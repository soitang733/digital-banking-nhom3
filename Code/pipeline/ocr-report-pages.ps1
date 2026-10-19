param([string]$Jobs)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null=[Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null=[Windows.Data.Pdf.PdfDocument,Windows.Data.Pdf,ContentType=WindowsRuntime]
$null=[Windows.Data.Pdf.PdfPageRenderOptions,Windows.Data.Pdf,ContentType=WindowsRuntime]
$null=[Windows.Storage.Streams.InMemoryRandomAccessStream,Windows.Storage.Streams,ContentType=WindowsRuntime]
$null=[Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging,ContentType=WindowsRuntime]
$null=[Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime]
$asyncGeneric=[System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {$_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'} | Select-Object -First 1
$asyncAction=[System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {$_.Name -eq 'AsTask' -and !$_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction'} | Select-Object -First 1
function Await-Result($Operation,[Type]$ResultType){$task=$asyncGeneric.MakeGenericMethod($ResultType).Invoke($null,@($Operation));try{$task.Wait()}catch{throw $_.Exception.GetBaseException().Message};return $task.Result}
function Await-Action($Operation){$task=$asyncAction.Invoke($null,@($Operation));$task.Wait()}
$engine=[Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages();if(!$engine){throw 'No installed OCR engine'}
$root=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'data/reports'))
$dest=Join-Path $PSScriptRoot 'data/report-ocr';$null=New-Item -ItemType Directory -Force -Path $dest
foreach($job in (Get-Content -Raw -Encoding UTF8 -LiteralPath $Jobs | ConvertFrom-Json)){
 $target=Join-Path $dest ($job.id+'.json');$cached=$null
 if(Test-Path -LiteralPath $target){$cached=Get-Content -Raw -Encoding UTF8 -LiteralPath $target | ConvertFrom-Json;if($cached.error){Write-Output ('Cannot render (recorded): '+$job.id);continue}}
 $done=@($cached.pages | ForEach-Object {$_.page});$needed=@($job.pages | Where-Object {$_ -notin $done})
 if(!$needed.Count){Write-Output ('Already OCR: '+$job.id);continue}
 $pdfPath=(Resolve-Path -LiteralPath $job.file).ProviderPath;if(!$pdfPath.StartsWith($root+'\',[StringComparison]::OrdinalIgnoreCase)){throw 'PDF outside report workspace'}
 $file=Await-Result ([Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)) ([Windows.Storage.StorageFile])
 try{$doc=Await-Result ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])}catch{
  [IO.File]::WriteAllText($target,(@{id=$job.id;pages=@();error=$_.Exception.Message}|ConvertTo-Json -Depth 8),[Text.UTF8Encoding]::new($false));Write-Output ('Cannot render '+$job.id+': '+$_.Exception.Message);continue
 }
 $results=@($cached.pages | Where-Object {$null -ne $_});$completed=0
 Write-Output ($job.id+' actual PDF pages: '+$doc.PageCount)
 foreach($number in $needed){
  if($number -gt $doc.PageCount){Write-Output ($job.id+' invalid page '+$number);continue}
  $page=$doc.GetPage([uint32]($number-1));$stream=[Windows.Storage.Streams.InMemoryRandomAccessStream]::new()
  $options=[Windows.Data.Pdf.PdfPageRenderOptions]::new();$options.DestinationWidth=1200;$options.DestinationHeight=[uint32](1200*$page.Size.Height/$page.Size.Width)
  try{
   Await-Action ($page.RenderToStreamAsync($stream,$options));$stream.Seek(0)
   $decoder=Await-Result ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
   $bitmap=Await-Result ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
   try{$result=Await-Result ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult]);$results+=@{page=[int]$number;text=$result.Text;method='Windows OCR';language=$engine.RecognizerLanguage.LanguageTag}}finally{$bitmap.Dispose()}
  }catch{Write-Output ($job.id+' page '+$number+': '+$_.Exception.Message);$results+=@{page=[int]$number;text='';method='Windows OCR';error=$_.Exception.Message}}finally{$page.Dispose();$stream.Dispose()}
  $completed++;if($completed % 20 -eq 0){Write-Output ($job.id+': '+$completed+'/'+$job.pages.Count)}
 }
 [IO.File]::WriteAllText($target,(@{id=$job.id;pdfPageCount=[int]$doc.PageCount;pages=$results}|ConvertTo-Json -Depth 8),[Text.UTF8Encoding]::new($false))
 Write-Output ('Finished '+$job.id+': '+$completed+' pages')
}
