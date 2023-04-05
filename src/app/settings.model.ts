export class Settings {

  public static readonly cineastBasePath = 'http://localhost:8080';
  public static readonly thumbnailBasePath = 'http://localhost:8080/thumbnails/';
  /**
   * Expects that objectBasePath/<objectId> serves the video
   */
  public static readonly objectBasePath = 'http://localhost:8080/objects/';
  public static readonly moreLikeThisCategory = 'clip';
  public static readonly queryCategories = [
    ['clip', 'Clip'], ['visualtextcoembedding', 'Co-Embedding']
  ];
  public static readonly dresBaseApi = "https://dmi-dres.dmi.unibas.ch"

}
