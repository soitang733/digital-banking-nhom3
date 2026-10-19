param([string]$Pdf,[int]$Page=1,[string]$Output,[switch]$Ocr)
$ErrorActionPreference='Stop'
$Pdf=(Resolve-Path -LiteralPath $Pdf).ProviderPath
$Output=[IO.Path]::GetFullPath($Output)
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null=[Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null=[Windows.Data.Pdf.PdfDocument,Windows.Data.Pdf,ContentType=WindowsRuntime]
$null=[Windows.Data.Pdf.PdfPageRenderOptions,Windows.Data.Pdf,ContentType=WindowsRuntime]
$null=[Windows.Storage.Streams.InMemoryRandomAccessStream,Windows.Storage.Streams,ContentType=WindowsRuntime]
$null=[Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging,ContentType=WindowsRuntime]
$null=[Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime]
$asyncGeneric=[System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {$_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'} | Select-Object -First 1
$asyncAction=[System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {$_.Name -eq 'AsTask' -and !$_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction'} | Select-Object -First 1
function Await-Result($Operation,[Type]$ResultType){$task=$asyncGeneric.MakeGenericMethod($ResultType).Invoke($null,@($Operation));$task.Wait();return $task.Result}
function Await-Action($Operation){$task=$asyncAction.Invoke($null,@($Operation));$task.Wait()}
$file=Await-Result ([Windows.Storage.StorageFile]::GetFileFromPathAsync($Pdf)) ([Windows.Storage.StorageFile])
$document=Await-Result ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
$pdfPage=$document.GetPage($Page-1)
$stream=[Windows.Storage.Streams.InMemoryRandomAccessStream]::new()
$options=[Windows.Data.Pdf.PdfPageRenderOptions]::new();$options.DestinationWidth=1800
try{
 Await-Action ($pdfPage.RenderToStreamAsync($stream,$options))
 $stream.Seek(0)
 $reader=[System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
 $target=[System.IO.File]::Create($Output);try{$reader.CopyTo($target)}finally{$target.Dispose()}
 if($Ocr){
  $stream.Seek(0)
  $decoder=Await-Result ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
  $bitmap=Await-Result ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
  $engine=[Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
  if(!$engine){throw 'No installed OCR language engine'}
  $result=Await-Result ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
  [IO.File]::WriteAllText($Output+'.txt',$result.Text,[Text.UTF8Encoding]::new($false))
  Write-Output ('OCR language: '+$engine.RecognizerLanguage.LanguageTag+'; characters: '+$result.Text.Length)
 }
}finally{$pdfPage.Dispose();$stream.Dispose()}
