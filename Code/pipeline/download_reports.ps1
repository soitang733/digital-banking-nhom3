param([int]$TimeoutSeconds=25)
$sourcePath=Join-Path (Split-Path -Parent $PSScriptRoot) 'dashboard/source-metadata.json'
$metadata=Get-Content -Raw -Encoding UTF8 -LiteralPath $sourcePath|ConvertFrom-Json
$reportDir=Join-Path $PSScriptRoot 'data/reports'
New-Item -ItemType Directory -Path $reportDir -Force|Out-Null
$manifest=@()
foreach($report in $metadata.reports){
  $bankSlug=$report.bank -replace '[^a-zA-Z0-9]','_'
  $target=Join-Path $reportDir ($report.id+'_'+$bankSlug+'_'+$report.year+'.pdf')
  $tempTarget=$target+'.download'
  try{
    if(!(Test-Path -LiteralPath $target)){
      Invoke-WebRequest -UseBasicParsing -Uri $report.url -OutFile $tempTarget -TimeoutSec $TimeoutSeconds
      $header=[byte[]]::new(5);$stream=[IO.File]::OpenRead($tempTarget)
      try{$headerCount=$stream.Read($header,0,5)}finally{$stream.Dispose()}
      if($headerCount -ne 5 -or [Text.Encoding]::ASCII.GetString($header) -ne '%PDF-'){throw 'Response is not a PDF file'}
      Move-Item -LiteralPath $tempTarget -Destination $target
    }
    $manifest+=[PSCustomObject]@{id=$report.id;bank=$report.bank;year=$report.year;type=$report.type;url=$report.url;status='downloaded';file=$target;sha256=(Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash;note='PDF downloaded; criterion evidence is not validated'}
    Write-Output ('DOWNLOADED '+$report.id+' '+$report.bank+' '+$report.year)
  }catch{
    $manifest+=[PSCustomObject]@{id=$report.id;bank=$report.bank;year=$report.year;type=$report.type;url=$report.url;status='needs-review';file='';sha256='';note=$_.Exception.Message}
    Write-Output ('NEEDS REVIEW '+$report.id+' '+$report.bank+' '+$report.year)
  }
  $manifest|ConvertTo-Json -Depth 5|Set-Content -Encoding UTF8 -LiteralPath (Join-Path $reportDir 'manifest.json')
}
Write-Output ('Completed: '+(@($manifest|Where-Object{$_.status -eq 'downloaded'}).Count)+'/'+$manifest.Count+' PDFs downloaded.')
