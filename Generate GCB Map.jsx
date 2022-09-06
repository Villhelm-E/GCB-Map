#target photoshop

//borrowed joojaa's code from https://graphicdesign.stackexchange.com/questions/104793/photoshop-script-to-select-specific-colors

//char lookup
function cTID(s) { return app.charIDToTypeID(s); }

//string lookup
function sTID(s) { return app.stringIDToTypeID(s); }

//Pass color to Photoshop's Color Range event
function selectColorRange(color) {
    //define Color Range Parameters
    var desc = new ActionDescriptor(); 
    //fuzziness
    desc.putInteger(cTID("Fzns"), 0 ); 
    //minumum color
    desc.putObject( cTID("Mnm "), cTID("RGBC"), color ); 
    //maximum color
    desc.putObject( cTID("Mxm "), cTID("RGBC"), color ); 
    
    //perform Color Range
    executeAction( cTID("ClrR"), desc, DialogModes.NO );

}

//Convert Hex color to Photoshop color class
function hexC(hex) {
    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    hex = hex.substring(1,7)
    bigint = parseInt(hex, 16);
    var color = new ActionDescriptor()
        color.putDouble(cTID("Rd  "), (bigint >> 16) & 255);
        color.putDouble(cTID("Grn "), (bigint >> 8) & 255);
        color.putDouble(cTID("Bl  "), bigint & 255);
    return color
}

//Determine if there is an active selection
//borrowed MaxJohnson's code from https://gist.github.com/theMikeD/a8ddb2a1f21307e4a21a
function hasSelection() {
    try{
        //will return True if there is a selection
        return (app.activeDocument.selection.bounds.length>0);
    }
    catch(err){
        return false;
    }
}

//Define possible colors per biome
var EF = ["#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB", "#A2BBCB"];
var EF = ["#A2BBCB", "#A6BFCF", "#AAC3D3", "#ACC5D4", "#ADC6D5", "#AEC7D5", "#8FA8BE", "#93ACC1", "#97B0C5", "#99B2C7", "#9AB3C8", "#9BB4C8", "#B1CADA", "#B5CEDE", "#B9D2E2", "#BBD4E4", "#BCD6E4", "#BDD6E5", "#9EB7CD", "#A2BBD1", "#A6BFD5", "#A8C1D6", "#A9C2D7", "#AAC3D7", "#C1DAEA", "#C4DDEE", "#C8E1F2", "#CAE3F3", "#CCE5F4", "#CDE6F4", "#AEC7DD", "#B1CAE1", "#B5CEE5", "#B8D0E6", "#B9D2E7", "#BAD3E7", "#CAE3F0", "#CEE7F4", "#D1EAF8", "#D4EDFA", "#D5EEFA", "#D6EFFA", "#B7D0E3", "#BBD4E7", "#BFD8EB", "#C1DAEC", "#C2DBED", "#C3DCED", "#D0E9F3", "#D3ECF7", "#D7F0FB", "#D9F2FC", "#DAF4FD", "#DBF4FD", "#BCD5E6", "#C0D9EA", "#C4DDEE", "#C6DFEF", "#C8E1F0", "#C9E2F0", "#D3ECF4", "#D6F0F8", "#DAF4FC", "#DCF6FE", "#DEF7FE", "#DFF8FE", "#C0D9E7", "#C4DDEB", "#C8E1EF", "#CAE3F0", "#CBE4F1", "#CCE5F1", "#566F95", "#597299", "#5D769D", "#5F789F", "#617A9F", "#627BA0", "#425C89", "#46608C", "#4A6490", "#4C6692", "#4E6793", "#4F6893", "#657EA5", "#6982A9", "#6C85AD", "#6F88AE", "#7089AF", "#718AAF", "#526B98", "#556E9B", "#59729F", "#5C75A1", "#5D76A2", "#5E77A2", "#748DB4", "#7891B8", "#7C95BC", "#7E97BE", "#7F98BE", "#8099BF", "#617AA7", "#657EAB", "#6982AF", "#6B84B1", "#6C85B1", "#6D86B2", "#7E96BB", "#819ABF", "#859EC2", "#87A0C4", "#88A2C5", "#89A2C5", "#6A83AE", "#6E87B1", "#728BB5", "#748DB7", "#768FB8", "#7790B8", "#839CBE", "#87A0C2", "#8BA3C5", "#8DA6C7", "#8EA7C7", "#8FA8C8", "#7089B0", "#748DB4", "#7891B8", "#7A93BA", "#7B94BA", "#7C95BB", "#87A0BF", "#8AA3C3", "#8EA7C6", "#90A9C8", "#92ABC8", "#93ABC9", "#738CB1", "#7790B5", "#7B94B9", "#7D96BB", "#7F98BB", "#8099BC"];
var ET = ["#98B8C2", "#9CBCC6", "#9EBEC8", "#9FC0C9", "#A0C0C9", "#A3C4CE", "#A7C7D2", "#ABCBD6", "#ADCDD7", "#AECFD8", "#AFD0D8", "#B3D3DE", "#B6D7E2", "#BADAE6", "#BCDDE7", "#BEDEE8", "#BFDFE8", "#BCDCE4", "#C0E0E8", "#C4E4EC", "#C6E6ED", "#C7E7EE", "#C8E8EE", "#C1E2E7", "#C5E6EB", "#C9E9EF", "#CBECF0", "#CDEDF1", "#CEEEF1", "#C5E5E8", "#C9E9EC", "#CDEDF0", "#CFEFF1", "#D0F1F2", "#D1F1F2", "#4F6F91", "#517293", "#537394", "#547494", "#5E7FA0", "#6181A2", "#6282A3", "#6383A3", "#6686A8", "#6A8AAC", "#6E8EB0", "#7090B2", "#7192B2", "#7292B3", "#6F90AF", "#7394B2", "#7797B6", "#7999B8", "#7B9BB9", "#7C9CB9", "#7595B1", "#7999B5", "#7D9DB9", "#7F9FBB", "#80A1BB", "#81A1BC", "#7899B2", "#7C9DB6", "#80A0BA", "#82A3BC", "#84A4BC", "#85A5BD", "#6DA49D", "#71A8A1", "#73AAA3", "#75ACA3", "#76ADA4", "#5F9594", "#619796", "#629997", "#639A97", "#79B0A9", "#7DB4AD", "#80B7B1", "#83BAB2", "#84BBB3", "#85BCB3", "#6DA4A3", "#70A7A5", "#71A8A6", "#72A9A6", "#88BFB8", "#8CC3BC", "#90C7C0", "#92C9C2", "#93CAC2", "#94CBC3", "#75ACAB", "#79B0AF", "#7DB4B3", "#7FB6B5", "#80B7B5", "#81B8B6", "#92C8BF", "#95CCC3", "#99CFC6", "#9BD2C8", "#9CD3C9", "#9DD4C9", "#7EB5B2", "#82B9B5", "#86BDB9", "#88BFBB", "#8AC1BC", "#8BC2BC", "#97CEC2", "#9BD1C6", "#9FD5C9", "#A1D7CB", "#A2D9CB", "#A3D9CC", "#84BBB4", "#88BFB8", "#8CC3BC", "#8EC5BE", "#8FC6BE", "#90C7BF", "#9BD1C3", "#9ED5C7", "#A2D9CA", "#A4DBCC", "#A6DCCC", "#A7DDCD", "#87BEB5", "#8BC2B9", "#8FC6BD", "#91C8BF", "#93C9BF", "#94CAC0"];
var BWk = ["#94B4BF", "#A2BBBB", "#47688A", "#566E86", "#5A687F", "#58587B", "#525479", "#6AA19A", "#578D8D", "#5C9A8E", "#6AA08A", "#6E9A83", "#6C8A7F", "#66857D", "#A3BA89", "#8FA77D", "#94B37D", "#A3BA7A", "#A08F61", "#A59B62", "#9A4C51", "#9F5852", "#823B4B", "#87484C"];
var BSk = ["#4B6C8D", "#5A7B9C", "#577799", "#597289", "#698198", "#657E95", "#5E6C83", "#6D7B92", "#69788E", "#5C5C7F", "#6B6B8E", "#68678A", "#56587D", "#65668D", "#626389", "#777699", "#8080A0", "#8180A3", "#8282A3", "#8382A4", "#717298", "#75769C", "#787AA0", "#7B7CA1", "#7C7DA2", "#7D7EA2", "#8A89A9", "#8B8BAA", "#8C8CAA", "#7A7B9E", "#7E7FA2", "#8283A6", "#8485A8", "#8587A8", "#8688A8", "#8685A2", "#8A89A6", "#8D8DAA", "#8F8FAC", "#9190AC", "#9291AD", "#8081A1", "#8485A5", "#8789A9", "#8A8BAA", "#8B8CAB", "#8C8DAB", "#8989A3", "#8D8CA7", "#9190AB", "#9392AD", "#9494AD", "#9595AE", "#8384A2", "#8788A6", "#8B8CAA", "#8D8EAB", "#8E90AC", "#8F91AC", "#5B9190", "#69A09F", "#669D9C", "#609E91", "#6EADA0", "#6BA99D", "#6DA48D", "#7DB39D", "#79B099", "#729E87", "#81AD96", "#7DAA92", "#708D83", "#7F9D92", "#7C998E", "#6A8981", "#799891", "#76958D", "#93AB80", "#A2BA8F", "#9FB68C", "#98B781", "#A7C690", "#A4C38D", "#A49364", "#B3A274", "#AF9E70", "#A99F65", "#B8AE75", "#B4AB71", "#9E5054", "#AD5F64", "#A95B60", "#A35C55", "#B26B65", "#AE6861", "#A25458", "#A4565A", "#A5575B", "#A6585B", "#B4666A", "#B5676A", "#C4767A", "#C5777A", "#CA7C7E", "#CC7E7F", "#CD7F80", "#CE8080", "#CF8181", "#D18382", "#D38583", "#D48683", "#D38582", "#D58783", "#D68884", "#D78984", "#8A4352", "#8C4554", "#8D4755", "#8E4855", "#995262", "#9B5563", "#9C5664", "#9D5764", "#995262", "#9B5563", "#9C5664", "#9D5764", "#A86272", "#AB6473", "#AC6574", "#AD6674", "#B26B78", "#B46D79", "#B56F7A", "#B6707A", "#B7717B", "#B9737C", "#BB747D", "#BC757D", "#BB747C", "#BC767D", "#BE787E", "#BF797E", "#863F4E", "#954E5E", "#914B5A", "#8B4C4F", "#9A5B5F", "#96575B"];
var DfcDscDwc = ["#A6BFBE", "#AAC2C2", "#ACC5C4", "#ADC6C5", "#AEC7C5", "#A6B5B4", "#AAB9B8", "#AEBCBB", "#B0BFBD", "#B2C0BE", "#B2C1BE", "#B1CACA", "#B5CECE", "#B9D2D2", "#BBD4D3", "#BDD5D4", "#BDD6D4", "#B6C4C3", "#B9C8C7", "#BDCCCB", "#BFCECD", "#C1CFCD", "#C2D0CD", "#C1D9DA", "#C4DDDE", "#C5D3D3", "#C9D7D7", "#CAE3E0", "#CEE6E4", "#CEDDD9", "#D2E1DD", "#D0E8E3", "#D3ECE7", "#D4E2DC", "#D7E6E0", "#D3ECE4", "#D6F0E8", "#D7E6DD", "#DBEAE1", "#5D768D", "#5F788F", "#617A90", "#627A90", "#6D859C", "#6F879E", "#70899F", "#718A9F", "#748DA4", "#7891A8", "#78879D", "#7E96AB", "#819AAE", "#8290A4", "#839CAD", "#87A0B1", "#8796A6", "#8B9AAA", "#879FAE", "#8AA3B2", "#8B99A7", "#8F9DAB", "#A6BE8D", "#AAC291", "#ACC493", "#AEC593", "#AFC694", "#97AF84", "#99B185", "#9BB286", "#9CB386", "#B2C999", "#B6CD9D", "#B9D1A1", "#BCD3A2", "#BDD5A3", "#BED5A3", "#A6BE93", "#A9C095", "#AAC196", "#ABC296", "#C1D9A8", "#C5DCAC", "#AEC69B", "#B2C99F", "#CBE2AF", "#CEE6B3", "#B7CFA2", "#BBD3A5", "#D0E8B2", "#D4EBB6", "#BDD4A4", "#C1D8A8", "#D4EBB3", "#D7EFB7", "#C0D8A5", "#C4DCA9", "#B3A26E", "#B7A672", "#BBAA76", "#BDAC77", "#BEAD78", "#BFAE78", "#A89768", "#AA996A", "#AB9A6B", "#AC9B6B", "#C2B17D", "#C6B581", "#CAB985", "#CCBB87", "#CDBD87", "#CEBD88", "#BAA97A", "#BBAA7A", "#D2C18D", "#D5C491", "#DBCA93", "#DFCD97", "#E1CF96", "#E4D39A", "#E4D397", "#E8D69B"];
var CwbCwc = ["#64A195", "#66A497", "#67A598", "#68A698", "#72B1A4", "#75B3A6", "#76B4A7", "#77B5A7", "#71A891", "#73AA93", "#75AC94", "#76AC94", "#81B7A0", "#83B9A2", "#84BBA3", "#85BCA3", "#75A28A", "#78A48C", "#79A58D", "#7AA68D", "#85B19A", "#87B39C", "#88B59C", "#89B69C", "#749186", "#769388", "#779589", "#789689", "#83A096", "#85A398", "#87A498", "#88A599", "#6E8D85", "#708F87", "#719187", "#729287", "#7D9C95", "#7F9F96", "#81A097", "#82A197", "#7AB8AC", "#7EBCB0", "#83C2B3", "#87C6B6", "#89C7B5", "#8DCBB9", "#8CCAB6", "#90CEBA", "#B3D29C", "#B7D6A0", "#BCDBA3", "#C0DFA6", "#C2E1A5", "#C6E5A9", "#C5E4A6", "#C9E8AA", "#C4BA81", "#C7BE85", "#CDC387", "#D1C78B", "#D2C98A", "#D6CC8E", "#D6CC8B", "#DAD08F", "#BE7771", "#C17B75", "#C78077", "#CB847B", "#CC867A", "#D08A7E", "#D0897B", "#D48D7F", "#A6666B", "#A96A6F", "#AF7071", "#B37475", "#B47574", "#B87978", "#B87975", "#BC7D79"];
var Cfc = ["#C8E1E2", "#CAE3E3", "#CCE5E4", "#CDE5E4", "#D2EAE8", "#D4ECE9", "#D5EEEA", "#D6EFEA", "#D7F0EB", "#D9F2EC", "#DAF3ED", "#DBF4ED", "#DAF3EC", "#DCF5ED", "#DEF7EE", "#DFF8EE", "#CCDBDB", "#CFDDDC", "#D0DEDD", "#D1DFDD", "#D6E4E1", "#D7E6E3", "#D9E8E3", "#DAE9E3", "#DBEAE4", "#DDECE5", "#DEEDE6", "#DFEEE6", "#DEEDE5", "#E0F0E6", "#E2F1E7", "#E3F2E7", "#7C94AC", "#7E97AE", "#7F98AE", "#8099AF", "#859EB2", "#87A0B4", "#89A1B5", "#89A2B5", "#8BA3B5", "#8DA5B7", "#8EA7B7", "#8FA8B8", "#8EA7B6", "#90A9B8", "#92AAB8", "#93ABB9", "#8291A7", "#8492A7", "#8493A8", "#8B9AAD", "#8D9BAE", "#8E9CAE", "#8F9DAE", "#91A0B0", "#92A1B0", "#93A2B1", "#92A1AF", "#94A3B1", "#96A4B1", "#97A5B2", "#C9E0B0", "#CBE2B2", "#CCE4B2", "#CDE5B3", "#D2E9B6", "#D4ECB8", "#D5EDB9", "#D6EEB9", "#D7EFB9", "#D9F1BB", "#DAF3BB", "#DBF3BC", "#DBF3BA", "#DDF5BC", "#DEF6BC", "#DFF7BD", "#B6CDA3", "#B8CFA5", "#B9D1A5", "#BAD2A6", "#BFD7A9", "#C1D9AB", "#C3DAAC", "#C4DBAC", "#C5DCAC", "#C7DEAE", "#C8E0AE", "#C9E1AF", "#C8E0AD", "#CAE2AF", "#CCE3AF", "#CDE4B0", "#D9C895", "#DBCA96", "#DDCC97", "#DECC97", "#E2D19B", "#E5D39D", "#E6D59D", "#E7D59D", "#E8D69E", "#EAD99F", "#EBDAA0", "#ECDBA0", "#ECDA9F", "#EEDCA1", "#EFDEA1", "#F0DEA1", "#CAB98A", "#CBBA8A", "#D0BF8E", "#D2C18F", "#D3C290", "#D4C390", "#D5C491", "#D7C692", "#D9C893", "#DAC993", "#D9C892", "#DBCA93", "#DCCB94", "#DDCC94"];
var Cfb = ["#82C0B4", "#84C2B6", "#85C4B6", "#86C4B7", "#8BC9BA", "#8DCBBC", "#8FCCBD", "#90CDBD", "#91CEBD", "#93D1BF", "#94D2BF", "#95D3C0", "#94D2BE", "#96D4C0", "#98D6C0", "#99D6C1", "#90C6B0", "#92C9B2", "#93CAB2", "#94CAB3", "#99CFB6", "#9BD1B8", "#9DD3B9", "#9DD4B9", "#9FD5B9", "#A1D7BB", "#A2D8BB", "#A3D9BC", "#A2D8BA", "#A4DABC", "#A6DCBC", "#A7DDBD", "#94C0A9", "#96C3AB", "#98C4AB", "#98C5AC", "#9DC9AF", "#9FCBB1", "#A1CDB2", "#A2CEB2", "#A3CFB2", "#A5D1B4", "#A6D2B4", "#A7D3B5", "#A6D2B3", "#A8D5B5", "#AAD6B5", "#ABD7B6", "#BBD9A4", "#BDDCA6", "#BEDDA6", "#BFDEA7", "#C4E3AA", "#C6E5AC", "#C8E6AD", "#C9E7AD", "#CAE8AD", "#CCEBAF", "#CDECAF", "#CEEDB0", "#CDECAE", "#CFEEB0", "#D1F0B0", "#D2F0B1", "#CBC189", "#CDC48A", "#CFC58B", "#D0C68B", "#D5CB8F", "#D7CC90", "#D8CE91", "#D9CF91", "#DAD092", "#DCD293", "#DED494", "#DFD494", "#DED393", "#E0D694", "#E1D795", "#E2D895"];
var DfaDfb = ["#7C8BA1", "#808EA5", "#8594A8", "#8998AB", "#7B7A9D", "#7E7EA1", "#8483A4", "#8887A7", "#B7A678", "#B9A879", "#C6B588", "#C9B789", "#B16368", "#B36569", "#C07278", "#C37479"];
var DsaDsb = ["#717F95", "#738197", "#748398", "#758498", "#6F6E92", "#717194", "#737294", "#747395", "#696A91", "#6B6D92", "#6D6E93", "#6E6F93", "#C2B184", "#CCBB8A", "#D1C08D", "#D5C48E", "#BC6E74", "#C6787A", "#CB7D7D", "#CF817E", "#A45E6E", "#AE6774", "#B36D77", "#B77078"];
var DwaDwb = ["#617086", "#647288", "#657389", "#667489", "#606082", "#626284", "#636385", "#646485", "#5A5C81", "#5C5E83", "#5D5F83", "#5E6083", "#BFAE80", "#C8B786", "#CDBC89", "#D1C08A", "#B96B70", "#C27476", "#C77979", "#CB7D7A", "#A15A6A", "#AA6370", "#AF6973", "#B36C74"];
var CsbCsc = ["#88BFA8", "#8CC3AC", "#92C8AF", "#95CBB2", "#97CDB1", "#9BD1B5", "#9BD1B2", "#9ED5B6", "#8CB9A1", "#90BDA5", "#96C2A8", "#99C6AC", "#9BC8AA", "#9FCBAE", "#9FCBAB", "#A3CFAF", "#8BA89D", "#8FACA1", "#92B0A5", "#95B2A7", "#96B4A7", "#97B4A8", "#85A49C", "#89A8A0", "#8CACA4", "#8FAEA5", "#90AFA6", "#91B0A6", "#94B2A4", "#98B5A8", "#9CB9AB", "#9EBBAD", "#9FBDAE", "#A0BEAE", "#8EADA2", "#92B1A6", "#96B5AA", "#98B7AC", "#99B9AC", "#9ABAAC", "#9AB7A6", "#9EBBAA", "#A1BFAE", "#A3C1B0", "#A5C2B0", "#A6C3B1", "#94B3A5", "#98B7A9", "#9BBBAD", "#9EBDAE", "#9FBEAF", "#A0BFAF", "#9DBBA7", "#A1BEAB", "#A5C2AF", "#A7C4B1", "#A8C6B1", "#A9C7B2", "#97B6A6", "#9BBAAA", "#9FBEAE", "#A1C0AF", "#A2C2B0", "#A3C3B0", "#9CBB85", "#9EBD86", "#A0BF87", "#A1BF87", "#ABCA94", "#AECC96", "#AFCE97", "#B0CF97", "#ADA369", "#AFA56B", "#B0A76C", "#B1A76C", "#BCB279", "#BEB47A", "#BFB67B", "#C0B77B", "#A76059", "#A9625B", "#AA645C", "#AB645C", "#B66F69", "#B8716A", "#B9736B", "#BA746B", "#C57E79", "#C7817A", "#C9827B", "#CA837B", "#CF887F", "#D18A80", "#D28B81", "#D38C81", "#D48D82", "#D69083", "#D89184", "#D99284", "#D89183", "#DA9384", "#DB9585", "#DC9585", "#8F4F53", "#915255", "#925356", "#935456", "#9E5F63", "#A06164", "#A16265", "#A26365", "#AD6E73", "#AF7074", "#B17275", "#B27275", "#B77779", "#B9797A", "#BA7B7B", "#BB7C7B", "#BC7D7C", "#BE7F7D", "#BF817E", "#C0817E", "#BF807D", "#C1837E", "#C3847F", "#C4857F"];
var BSh = ["#A6BE7D", "#B6CD8C", "#B2C989", "#ABB877", "#BAC786", "#B6C382", "#A9A773", "#B8B682", "#B5B27E", "#A3A371", "#B2B280", "#AFAE7D", "#B7A661", "#C6B571", "#C2B16D", "#BBA05B", "#CAAF6A", "#C7AB66", "#BA8F57", "#C99E66", "#C59A62", "#B48B55", "#C39A65", "#BF9661", "#B16351", "#C07261", "#BC6E5D", "#B55D4B", "#C46C5A", "#C16856", "#B44C47", "#C35B56", "#BF5752", "#AE4845", "#BD5755", "#B95351", "#99524B", "#A8615B", "#A45E57", "#9D4C45", "#AC5B54", "#A95850", "#9C3B41", "#AB4B50", "#A7474C", "#96373F", "#A5464F", "#A1434B"];
var BWh = ["#A7B473", "#A5A36F", "#9F9F6D", "#B3A25E", "#B79C57", "#B68B53", "#B08751", "#AD5F4E", "#B15947", "#B04843", "#AA4441", "#954E48", "#994841", "#98383D", "#92333B"];
var Cwa = ["#AAC181", "#ACC482", "#AEC583", "#AFC683", "#BAD190", "#BCD392", "#BDD493", "#BED593", "#AEBB7A", "#B1BE7C", "#B2BF7D", "#B3C07D", "#BECB89", "#C0CD8B", "#C1CE8C", "#C2CF8C", "#ADAB76", "#AFAD78", "#B0AE79", "#B1AF79", "#BCBA86", "#BEBC87", "#C0BE88", "#C1BE88", "#A7A775", "#A9A977", "#AAAA77", "#ABAB77", "#B6B684", "#B8B886", "#BAB986", "#BBBA87", "#C1D898", "#C5DC9C", "#CBE29F", "#CEE5A2", "#D0E7A1", "#D4EBA5", "#D4EBA2", "#D7EFA6", "#D2C07D", "#D5C481", "#DBCA83", "#DFCD87", "#E1CF86", "#E4D38A", "#E4D287", "#E8D68B", "#CC7D6D", "#CF8171", "#D58773", "#D98A77", "#DB8C76", "#DE907A", "#DE9077", "#E2947B", "#B46D67", "#B7716B", "#BD766D", "#C07A71", "#C27C70", "#C68074", "#C67F71", "#C98375"];
var Cfa = ["#C9E0A0", "#CBE2A2", "#CCE4A2", "#CDE4A3", "#D2E9A6", "#D4EBA8", "#D6EDA9", "#D6EEA9", "#D7EFA9", "#D9F1AB", "#DBF2AB", "#DBF3AC", "#DBF2AA", "#DDF4AC", "#DEF6AC", "#DFF7AD", "#CDDA99", "#CFDC9B", "#D1DD9B", "#D1DE9C", "#D6E39F", "#D8E5A1", "#D9E7A2", "#DAE8A2", "#DBE9A2", "#DDEBA4", "#DFECA4", "#E0EDA5", "#DFECA3", "#E1EFA5", "#E2F0A5", "#E3F1A6", "#CBC995", "#CECC97", "#CFCD97", "#D0CE98", "#D5D39B", "#D7D59D", "#D8D69E", "#D9D79E", "#DAD89E", "#DCDAA0", "#DDDCA0", "#DEDDA1", "#DDDC9F", "#E0DEA1", "#E1DFA1", "#E2E0A2", "#C5C594", "#C8C895", "#C9C996", "#CACA96", "#CFCF9A", "#D1D19C", "#D2D29C", "#D3D39C", "#D4D49D", "#D7D69E", "#D7D89F", "#D8D99F", "#D7D89E", "#DADA9F", "#DBDBA0", "#DCDCA0", "#D9C885", "#DBCA86", "#DDCC87", "#DECC87", "#E3D18B", "#E5D38C", "#E6D48D", "#E7D58D", "#E8D68E", "#EAD88F", "#ECDA90", "#ECDB90", "#ECDA8F", "#EEDC90", "#EFDD91", "#F0DE91", "#D38575", "#D58776", "#D78977", "#D88977", "#DD8E7B", "#DF907C", "#E0927D", "#E1937D", "#E2947E", "#E4967F", "#E69780", "#E69880", "#E6977F", "#E89980", "#E99B81", "#EA9C81", "#BB746F", "#BD7770", "#BE7871", "#BF7971", "#C47E75", "#C68076", "#C88177", "#C88277", "#CA8378", "#CC8579", "#CD877A", "#CE887A", "#CD8779", "#CF897A", "#D18A7B", "#D28B7B"];
var Csa = ["#C5D291", "#C9D695", "#CFDC98", "#D2E09C", "#D4E19A", "#D8E59E", "#D7E59B", "#DBE99F", "#C4C28D", "#C8C691", "#CDCB94", "#D1CF98", "#D3D196", "#D7D49A", "#D6D497", "#DAD89B", "#BEBE8C", "#C2C190", "#C7C792", "#CBCB96", "#CDCC95", "#D1D099", "#D0D096", "#D4D49A", "#BBA965", "#BDAC67", "#BEAD68", "#BFAE68", "#CAB975", "#CCBB76", "#CEBC77", "#CEBD77", "#B56655", "#B76957", "#B86A58", "#B96B58", "#C47665", "#C67866", "#C87967", "#C87A67", "#9D564F", "#9F5851", "#A05A52", "#A15A52", "#AC655F", "#AE6760", "#B06961", "#B06A61"];
var Aw = ["#BFA35E", "#C1A660", "#C3A761", "#C3A861", "#BD935A", "#C0955C", "#C1965D", "#C2975D", "#B78F59", "#BA915B", "#BB925B", "#BC935B", "#B9604E", "#BB6350", "#BD6451", "#BD6551", "#B7504A", "#BA524C", "#BB534D", "#BC544D", "#B14C49", "#B44E4B", "#B54F4B", "#B6504B", "#A15048", "#A3524A", "#A5534B", "#A5544B", "#9F3F44", "#A24146", "#A34347", "#A44447", "#993B43", "#9C3D45", "#9D3F45", "#9E4045", "#D6BA76", "#DFC47C", "#E5C97F", "#E8CC80", "#D4AA72", "#DEB378", "#E3B97B", "#E7BC7C", "#CEA670", "#D8AF77", "#DDB479", "#E1B87A", "#D07766", "#D9816C", "#DF866F", "#E28A70", "#CE6762", "#D87068", "#DD766B", "#E1796C", "#C86360", "#D26C67", "#D77169", "#DB756A", "#B86760", "#C17066", "#C67669", "#CA796A", "#B6565C", "#BF6062", "#C56565", "#C86966", "#B0525A", "#BA5B61", "#BF6163", "#C26464"];
var Am = ["#CEB36E", "#D0B570", "#D2B670", "#D3B770", "#DABE7A", "#DDC27E", "#E0C47F", "#E3C880", "#E7CB84", "#E9CD83", "#ECD087", "#ECD084", "#CDA26A", "#CFA46C", "#D0A66C", "#D1A66D", "#D8AE76", "#DCB17A", "#DEB47B", "#E1B77C", "#E5BB80", "#E7BC7F", "#EBC083", "#EBC080", "#C79E69", "#C9A06A", "#CAA16B", "#CBA26B", "#D2A974", "#D6AD78", "#D8B07A", "#DCB37B", "#DFB77E", "#E1B87D", "#E5BC81", "#E5BC7E", "#C8705E", "#CA7260", "#CC7360", "#CD7460", "#D47B6A", "#D77F6E", "#DA816F", "#DD8570", "#E18874", "#E38A73", "#E68E77", "#E68E74", "#C75F5A", "#C9615C", "#CA635C", "#CB635D", "#D26B66", "#D66E6A", "#D8716B", "#DB746C", "#DF7870", "#E1796F", "#E57D73", "#E57D70", "#C15B59", "#C35D5A", "#C45E5B", "#C55F5B", "#CC6664", "#D06A68", "#D26D6A", "#D6706B", "#D9746E", "#DB756D", "#DF7971", "#DF796E", "#B05F58", "#B2615A", "#B4635A", "#B5645A", "#BC6B64", "#BF6E68", "#C17169", "#C4746A", "#C8786E", "#CA7A6D", "#CE7D71", "#CE7D6E", "#AF4E54", "#B15156", "#B25256", "#B35357", "#BA5A60", "#BD5E64", "#C06065", "#C36366", "#C7676A", "#C96969", "#CC6D6D", "#CC6C6A", "#A94A53", "#AB4D54", "#AC4E55", "#AD4F55", "#B4565E", "#B85A62", "#BA5C64", "#BD5F65", "#C16368", "#C36567", "#C6696B", "#C66868"];
var Af = ["#E1C580", "#E2C680", "#E9CD86", "#EACE86", "#EBCF86", "#EED388", "#F0D489", "#F1D589", "#F0D488", "#F2D689", "#F3D78A", "#F4D88A", "#DFB57C", "#E0B67C", "#E7BD82", "#E9BE82", "#EABF82", "#EDC284", "#EEC485", "#EFC585", "#EEC484", "#F1C685", "#F2C786", "#F3C886", "#D9B17A", "#DAB27B", "#E1B980", "#E3BA81", "#E4BB81", "#E7BE83", "#E8C083", "#E9C184", "#E8C082", "#EBC284", "#ECC384", "#EDC485", "#DB8270", "#DC8370", "#E38A76", "#E48C76", "#E58D76", "#E89078", "#EA9179", "#EB9279", "#EA9178", "#EC9479", "#ED957A", "#EE967A", "#D9726C", "#DA736C", "#E17A72", "#E37B72", "#E47C72", "#E77F74", "#E88175", "#E98275", "#E88174", "#EB8375", "#EC8476", "#EC8576", "#D36E6A", "#D46F6B", "#DB7670", "#DD7771", "#DE7871", "#E17B73", "#E27D73", "#E37E74", "#E27D72", "#E57F74", "#E68074", "#E78175", "#C3726A", "#C3736A", "#CA7A70", "#CC7B70", "#CD7C70", "#D08072", "#D18173", "#D28273", "#D18172", "#D38373", "#D58474", "#D68574", "#C16266", "#C26266", "#C9696C", "#CA6B6C", "#CB6C6C", "#CE6F6E", "#D0706F", "#D1716F", "#D0706E", "#D2726F", "#D37470", "#D47570", "#BB5D64", "#BC5E65", "#C3656A", "#C4676C", "#C5686B", "#C96B6D", "#CA6C6D", "#CB6D6E", "#CA6C6C", "#CC6E6E", "#CD706E", "#CE716F"];

//define biome color scheme
var EFColor =        "686868";
var ETColor =        "B2B2B2";
var BWkColor =       "F19B98";
var BSkColor =       "FADB76";
var DfcDscDwcColor = "347C7C";
var CwbCwcColor =    "67AC58";
var CfcColor =       "65C33A";
var CfbColor =       "92FA5B";
var DfaDfbColor =    "6AE0FC";
var DsaDsbColor =    "D037DB";
var DwaDwbColor =    "8496E7";
var CsbCscColor =    "C7C540";
var BShColor =       "EBA53A";
var BWhColor =       "EA3223";
var CwaColor =       "AFFBA1";
var CfaColor =       "D3FC6D";
var CsaColor =       "FFFD54";
var AwColor =        "5DA9F3";
var AmColor =        "2779F6";
var AfColor =        "0023F4";

//create SolidColor
fillColor = new SolidColor();

//Color filling loops
//EF
//loop through EF colors
for (i = 0; i < EF.length; i++) {
    //select color range
    selectColorRange(hexC(EF[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = EFColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//ET
//loop through ET colors
for (i = 0; i < ET.length; i++) {
    //select color range
    selectColorRange(hexC(ET[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = ETColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//DfcDscDwc
//loop through DfcDscDwc colors
for (i = 0; i < DfcDscDwc.length; i++) {
    //select color range
    selectColorRange(hexC(DfcDscDwc[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = DfcDscDwcColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//DsaDsb
//loop through DsaDsb colors
for (i = 0; i < DsaDsb.length; i++) {
    //select color range
    selectColorRange(hexC(DsaDsb[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = DsaDsbColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//DfaDfb
//loop through DfaDfb colors
for (i = 0; i < DfaDfb.length; i++) {
    //select color range
    selectColorRange(hexC(DfaDfb[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = DfaDfbColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//DwaDwb
//loop through DwaDwb colors
for (i = 0; i < DwaDwb.length; i++) {
    //select color range
    selectColorRange(hexC(DwaDwb[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = DwaDwbColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//Cfc
//loop through Cfc colors
for (i = 0; i < Cfc.length; i++) {
    //select color range
    selectColorRange(hexC(Cfc[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = CfcColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//Cfb
//loop through Cfb colors
for (i = 0; i < Cfb.length; i++) {
    //select color range
    selectColorRange(hexC(Cfb[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = CfbColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//Cfa
//loop through Cfa colors
for (i = 0; i < Cfa.length; i++) {
    //select color range
    selectColorRange(hexC(Cfa[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = CfaColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//CwbCwc
//loop through CwbCwc colors
for (i = 0; i < CwbCwc.length; i++) {
    //select color range
    selectColorRange(hexC(CwbCwc[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = CwbCwcColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//Cwa
//loop through Cwa colors
for (i = 0; i < Cwa.length; i++) {
    //select color range
    selectColorRange(hexC(Cwa[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = CwaColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//CsbCsc
//loop through CsbCsc colors
for (i = 0; i < CsbCsc.length; i++) {
    //select color range
    selectColorRange(hexC(CsbCsc[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = CsbCscColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//Csa
//loop through Csa colors
for (i = 0; i < Csa.length; i++) {
    //select color range
    selectColorRange(hexC(Csa[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = CsaColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//BSk
//loop through BSk colors
for (i = 0; i < BSk.length; i++) {
    //select color range
    selectColorRange(hexC(BSk[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = BSkColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//BSh
//loop through BSh colors
for (i = 0; i < BSh.length; i++) {
    //select color range
    selectColorRange(hexC(BSh[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = BShColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//Aw
//loop through Aw colors
for (i = 0; i < Aw.length; i++) {
    //select color range
    selectColorRange(hexC(Aw[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = AwColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//Af
//loop through Af colors
for (i = 0; i < Af.length; i++) {
    //select color range
    selectColorRange(hexC(Af[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = AfColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//Am
//loop through Am colors
for (i = 0; i < Am.length; i++) {
    //select color range
    selectColorRange(hexC(Am[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = AmColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//BWk
//loop through BWk colors
for (i = 0; i < BWk.length; i++) {
    //select color range
    selectColorRange(hexC(BWk[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = BWkColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}

//BWh
//loop through BWh colors
for (i = 0; i < BWh.length; i++) {
    //select color range
    selectColorRange(hexC(BWh[i]));
    
    //if color is found
    if (hasSelection()) {
        //fill selection with color
        fillColor.rgb.hexValue = BWhColor;
        app.activeDocument.selection.fill(fillColor);
        
        //deselect
        app.activeDocument.selection.deselect();
    }
}