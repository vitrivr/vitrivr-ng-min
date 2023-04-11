export class Settings {

  public static readonly cineastBasePath = 'http://localhost:8080';
  public static readonly thumbnailBasePath = 'http://localhost:8080/thumbnails/';
  /**
   * Expects that objectBasePath/<objectId> serves the video
   */
  public static readonly objectBasePath = 'http://localhost:8080/objects/';
  public static readonly moreLikeThisCategory = 'cliptext';
  public static readonly queryCategories = [
    ['visualtextcoembedding', 'Scene description'], ['ocr', 'Text on Screen'], ['whisper', 'Speech']
  ];
  public static readonly dresBaseApi = "https://dmi-dres.dmi.unibas.ch"

}
