import generateCSharpFields from './CSharpFieldGen.js';
import CSharpField from './CSharpField.js';

// Generate the C# code for the class with field info
export function generateCsharpCode(glyphs, importedCSharpFieldMappings, settings) {
    return generateCSharpClassCode({
        className: settings.className,
        fields: generateCSharpFields(glyphs, importedCSharpFieldMappings, settings)
    });
}

/**
 * @param {Object} o
 * @param {string} o.className 
 * @param {CSharpField[]} o.fields 
 */
function generateCSharpClassCode({ className, fields }) {
    if (!className)
        className = "AppIconFont";

    let s = '';
    s += `\nstatic class ${className}`;
    s += "\n{";
    s += "\n\tpublic static string AsString(this AppIcons icon) => icon == AppIcons.None ? string.Empty : char.ConvertFromUtf32((int)icon);";
    s += "\n"; 
    fields.sort(f => f.name).forEach(f => s += generateCSharpCodeForField(f));
    s += "\n}";

    s += `\n\npublic enum AppIcons`;
    s += "\n{";
    s += "\n\tNone = 0,";
    fields.sort(f => f.name).forEach(f => s += generateCSharpCodeEnumForField(f));
    s += "\n}";
    return s;

    function generateCSharpCodeForField(field) {
        return `\n\tpublic const string ${field.name} = "${field.value}";`;
    }

    function generateCSharpCodeEnumForField(field) {
    const codePoint = parseInt(field.value.replace('\\u', ''), 16);
    const hexValue = codePoint.toString(16);
    return `\n\t${field.name} = 0x${hexValue},`;
    }
}

/*
function generateXAMLCode(fontName, fontFileName) {
    const s = `<OnPlatform x:Key="IconsFontFamily"\n            x:TypedArguments="x:String"\n            Android=\"${fontFileName}#${fontName}\"\n            iOS="${fontName}" />`;
    return htmlEncode(s);
}*/