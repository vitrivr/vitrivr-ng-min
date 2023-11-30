export class Settings {

  public static readonly cineastBasePath = 'http://localhost:1865';
  public static readonly thumbnailBasePath = 'C:\\Users\\walten0000\\Documents\\myRepo\\ch.unibas\\Work\\archipanion-local-rescources\\thumbnails';
  /**
   * Expects that objectBasePath/<objectId> serves the video
   */
  public static readonly objectBasePath = 'https://min.vitrivr.tech/objects/';
  public static readonly moreLikeThisCategory = 'cliptext';
  public static readonly queryCategories = [
    ['visualtextcoembedding', 'Scene description'], ['ocr', 'Text on Screen'], ['whisper', 'Speech']
  ];
  public static readonly dresBaseApi = "https://vbs.videobrowsing.org"
  public static readonly dresUser = 'vitrivr4b'
  public static readonly dresPassword = 'PYDmvy3bR86dJTUYAMnG'

}
