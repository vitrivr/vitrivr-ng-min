export class Settings {

  public static readonly cineastBasePath = 'http://localhost:1865';
  public static readonly engineBasePath = 'http://localhost:7070';

  // path to the thumbnails, selected schema is added automatically to the path
  public static readonly thumbnailBasePath = 'http://localhost:8080/thumbnails/MVK/';
  public static readonly schemas = [
    'MVK', 'V3C', 'VBSLHE'
  ];

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
