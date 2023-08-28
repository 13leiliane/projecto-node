import fse from "fs-extra";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import imageminWebp from "imagemin-webp";
import imageminGifsicle from "imagemin-gifsicle";
import sharp from "sharp";

/*funciones para optimizar las fotos*/

let inputFolder = "src"; // para referencias a las imagens
let outputFolder = "opt";// para otimizar las imagens 
let targetWidth = 1920; //para controlar el ancho, estabelecimento

// esta funcion asyncrona.   
const processImg = async () => {
  // este arreglo va aller los archivos de imagens
  try {
    const files = await fse.readdir(inputFolder);

    for (const file of files) {
      //Las referencias de las dos inagens, path es la ruta 
    
      let inputPath = `${inputFolder}/${file}`;
      let outputPath = `${outputFolder}/${file}`;


      //((SHARP) acelera el processo deoptimizacion 
      await sharp(inputPath).resize(targetWidth).toFile(outputPath);

      await imagemin([outputPath], {
        destination: outputFolder,
        plugins: [
          imageminJpegtran({ quality: 80 }), // Comprimir imagen JPG con calidad del 80%
          imageminPngquant(), // Comprimir imagen PNG
          imageminSvgo(), // Comprimir imagen SVG
          imageminWebp({ quality: 80 }), // Comprimir imagen WebP con calidad del 80%
          imageminGifsicle(), // Comprimir imagen GIF
        ],
      });

      console.log(`Se ha optimizado la imagen: ${file}`);
    }

    console.log("Se ha terminado la optimización de todas tus imágenes");
  } catch (err) {
    console.error(err);
  }
};

processImg();

