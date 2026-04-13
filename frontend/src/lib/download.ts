export function downloadBlob(params: { blob: Blob; filename: string }) {
  const url = URL.createObjectURL(params.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = params.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

