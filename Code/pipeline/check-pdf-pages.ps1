$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null=[Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null=[Windows.Data.Pdf.PdfDocument,Windows.Data.Pdf,ContentType=WindowsRuntime]
$method=[System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {$_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'} | Select-Object -First 1
function Await($op,[Type]$t){$task=$method.MakeGenericMethod($t).Invoke($null,@($op));$task.Wait();return $task.Result}
$output=@()
foreach($r in (Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $PSScriptRoot 'data/reports/manifest.json') | ConvertFrom-Json)){
 try{$file=Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync((Resolve-Path -LiteralPath $r.file).ProviderPath)) ([Windows.Storage.StorageFile]);$pdf=Await ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument]);$output+=@{id=$r.id;pages=[int]$pdf.PageCount}}catch{$output+=@{id=$r.id;pages=$null;error=$_.Exception.GetBaseException().Message}}
}
[IO.File]::WriteAllText((Join-Path $PSScriptRoot 'data/pdf-page-counts.json'),($output|ConvertTo-Json -Depth 5),[Text.UTF8Encoding]::new($false))
$output | ForEach-Object {Write-Output ($_.id+': '+$_.pages+' '+$_.error)}
