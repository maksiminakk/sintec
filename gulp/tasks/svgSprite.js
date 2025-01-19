import gulp from "gulp";
import svgSprite from "gulp-svg-sprite";
import cheerio from "gulp-cheerio";
import replace from "gulp-replace";
import svgmin from "gulp-svgmin";

// Конфигурация для SVG-спрайта
const config = {
    mode: {
        symbol: { // Генерация спрайта <symbol>
            sprite: "../sprite.svg", // Имя файла спрайта
            example: true, // Создание HTML-демо для проверки (опционально)
        },
    },
    shape: {
        transform: [
            {
                svgo: {
                    plugins: [
                        { name: "removeViewBox", active: false }, // Сохранить viewBox
                        { name: "removeAttrs", params: { attrs: "(fill|stroke|style)" } }, // Удалить атрибуты fill, stroke, style
                        { name: "cleanupIDs", active: false }, // Отключить очистку ID
                    ],
                },
            },
        ],
    },
}

// Задача для генерации SVG-спрайта
export const svgSpriteTask = () => {
    return gulp
        .src(app.path.src.svgicons) // Убедитесь, что используется правильный путь
        .pipe(svgmin({ // Минификация SVG
            js2svg: { pretty: true },
        }))
        .pipe(cheerio({ // Удаление ненужных атрибутов
            run: ($) => {
                $('[fill]').removeAttr('fill'); // Удалить атрибут fill
                $('[stroke]').removeAttr('stroke'); // Удалить атрибут stroke
                $('[style]').removeAttr('style'); // Удалить атрибут style
            },
            parserOptions: { xmlMode: true },
        }))
        .pipe(replace('&gt;', '>')) // Исправление символа >
        .pipe(svgSprite(config)) // Генерация спрайта
        .pipe(gulp.dest(app.path.build.icons)); // Путь для сохранения
};
