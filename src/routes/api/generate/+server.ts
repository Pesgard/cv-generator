import type { RequestHandler } from './$types';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { buildLatex } from '$lib/generation/buildLatex';

// Carpeta temporal para trabajar (se ignora en git)
const WORKDIR = path.resolve('.output');

export const POST: RequestHandler = async ({ request }) => {
  try {
    const cvData = await request.json();

    // Generamos el código LaTeX
    const texContent = buildLatex(cvData);
    console.log('✅ Código LaTeX generado' + texContent);

    // Asegurar directorio de trabajo
    if (!fs.existsSync(WORKDIR)) {
      fs.mkdirSync(WORKDIR);
    }

    const texPath = path.join(WORKDIR, 'cv.tex');
    fs.writeFileSync(texPath, texContent, 'utf-8');

    // Compilar con tectonic
    execSync(`tectonic ${texPath} --outdir ${WORKDIR}`, { stdio: 'inherit' });

    // Localizar el PDF generado
    let pdfPath = path.join(WORKDIR, 'cv.pdf');
    if (!fs.existsSync(pdfPath)) {
      const alt = fs.readdirSync(WORKDIR).find((f) => f.endsWith('.pdf'));
      if (!alt) throw new Error('No se generó ningún PDF');
      pdfPath = path.join(WORKDIR, alt);
    }

    const pdf = fs.readFileSync(pdfPath);

    return new Response(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cv.pdf"'
      }
    });
  } catch (err: any) {
    console.error('❌ Error generando PDF:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Error generando el CV' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};