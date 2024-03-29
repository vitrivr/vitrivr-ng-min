export class Settings {

  public static readonly cineastBasePath = 'https://min.vitrivr.tech';
  public static readonly thumbnailBasePath = 'https://min.vitrivr.tech/thumbnails/';
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
