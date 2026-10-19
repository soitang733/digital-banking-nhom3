Add-Type -AssemblyName System.IO.Compression.FileSystem
function Read-BookEntry($zip,$name){
  $entry=$zip.GetEntry($name)
  if(!$entry){return $null}
  $reader=[IO.StreamReader]::new($entry.Open())
  try{$reader.ReadToEnd()}finally{$reader.Dispose()}
}
$workbookData=@{}
$inputRoot=Split-Path -Parent $PSScriptRoot
foreach($file in Get-ChildItem -LiteralPath $inputRoot -Filter '*.xlsx'){
  $zip=[IO.Compression.ZipFile]::OpenRead($file.FullName)
  try{
    $strings=@();$raw=Read-BookEntry $zip 'xl/sharedStrings.xml'
    if($raw){$xml=[xml]$raw;$strings=@($xml.sst.si|ForEach-Object{$_.InnerText})}
    $book=[xml](Read-BookEntry $zip 'xl/workbook.xml')
    $rels=[xml](Read-BookEntry $zip 'xl/_rels/workbook.xml.rels')
    $sheets=@{}
    foreach($sheet in $book.workbook.sheets.sheet){
      $rid=$sheet.GetAttribute('id','http://schemas.openxmlformats.org/officeDocument/2006/relationships')
      $target=($rels.Relationships.Relationship|Where-Object{$_.Id -eq $rid}).Target
      $target=if($target.StartsWith('/')){$target.TrimStart('/')}else{'xl/'+$target}
      $xml=[xml](Read-BookEntry $zip $target)
      $sheets[$sheet.name]=@($xml.worksheet.sheetData.row|ForEach-Object{
        $row=@{}
        foreach($c in $_.c){$value=$c.v;if($c.t -eq 's'){$value=$strings[[int]$c.v]}elseif($c.t -eq 'inlineStr'){$value=$c.is.InnerText};if($null -ne $value){$row[$c.r]=[string]$value}}
        $row
      })
    }
    $workbookData[$file.Name]=$sheets
  }finally{$zip.Dispose()}
}
$cacheDir=Join-Path $PSScriptRoot '.sites-local'
New-Item -ItemType Directory -Path $cacheDir -Force|Out-Null
$workbookData|ConvertTo-Json -Depth 12|Set-Content -Encoding UTF8 -LiteralPath (Join-Path $cacheDir 'workbooks.json')
Write-Output 'Read current workbooks without editing them.'
