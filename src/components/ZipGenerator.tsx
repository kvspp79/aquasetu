import { useState } from 'react';
import { Download, CheckCircle2, AlertTriangle, FileArchive, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { downloadableProjectFiles } from '../data/projectFiles';

export default function ZipGenerator() {
  const [isBundling, setIsBundling] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleDownload = async () => {
    setIsBundling(true);
    setDownloadSuccess(false);
    setErrorText('');

    try {
      const zip = new JSZip();

      // Loop over downloadable static files and append them to zip
      downloadableProjectFiles.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Generate the ZIP file blob
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Trigger download
      const blobUrl = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'AquaSetu_Explainable_Water_Allocation_Framework.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsBundling(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setIsBundling(false);
      setErrorText(err.message || 'Compression engine error');
    }
  };

  return (
    <div className="bg-slate-900/30 border border-slate-800 p-4 rounded-lg space-y-3.5">
      <div className="flex items-start gap-3">
        <div className="bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-lg text-cyan-400">
          <FileArchive className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">Download Production Code package</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-0.5">
            Get the full-stack codebase containing the Python FastAPI backend, Google OR-Tools optimization engine, PostgreSQL schemas, and deployment scripts for Supabase.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          id="btn-download-full-project-zip"
          onClick={handleDownload}
          disabled={isBundling}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2 rounded shadow-md shadow-cyan-500/10 flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          {isBundling ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Compressing Modules...
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              Project Downloaded!
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Download AquaSetu Framework (.zip)
            </>
          )}
        </button>

        <span className="text-[9px] font-mono text-slate-500">
          SIZE: ~45KB | ZIP Comp: DEFLATE (level 9)
        </span>
      </div>

      {errorText && (
        <div className="bg-rose-950/20 border border-rose-500/30 text-rose-300 p-2.5 rounded-lg text-xs flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>Error generating bundle: {errorText}</span>
        </div>
      )}
    </div>
  );
}
