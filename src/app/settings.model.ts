export class Settings {

  public static readonly cineastBasePath = 'http://localhost:1865';
  public static readonly engineBasePath = 'http://localhost:7070';

  // path to the thumbnails, selected schema is added automatically to the path
  public static readonly thumbnailBasePath = 'http://localhost:8080/thumbnails';
  public static readonly schemas = [
    'MVK', 'V3C', 'VBSLHE'
  ];
  public static readonly schema = Settings.schemas[0]

  public static readonly resultPageSize = 50;

  /**
   * Expects that objectBasePath/<objectId> serves the video
   */
  public static readonly objectBasePath = 'http://localhost:8080/media';
  public static readonly moreLikeThisCategory = 'cliptext';
  public static readonly queryCategories = [
    ['visualtextcoembedding', 'Scene description'], ['ocr', 'Text on Screen'], ['whisper', 'Speech']
  ];
  public static readonly dresBaseApi = "https://vbs.videobrowsing.org"
  public static readonly dresUser = 'vitrivr4b'
  public static readonly dresPassword = 'PYDmvy3bR86dJTUYAMnG'

}
