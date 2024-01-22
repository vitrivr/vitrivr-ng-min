export class Settings {

  public static readonly cineastBasePath = 'http://localhost:1865';
  public static readonly engineBasePath = 'http://localhost:7070';

  // path to the thumbnails, selected schema is added automatically to the path
  public static readonly thumbnailBasePath = 'http://localhost:8080/thumbnails';
  public static readonly schemas = [
    'MVK', 'V3C', 'VBSLHE'
  ];
  public static readonly schema = Settings.schemas[1]

  public static readonly resultPageSize = 300;

  /**
   * Expects that objectBasePath/<objectId> serves the video
   */
  public static readonly objectBasePath = 'http://localhost:8080/media';
  //public static readonly moreLikeThisCategory = 'cliptext';
  public static readonly queryCategories = [
    ['clip', 'Scene description'], ['ocr', 'Text on Screen'], ['whisperasr', 'Speech']
  ];
  public static readonly dresBaseApi = "https://vbs.videobrowsing.org"
  public static readonly dresUser = 'vitrivr1'
  public static readonly dresPassword = 'vitrivr1'

}
