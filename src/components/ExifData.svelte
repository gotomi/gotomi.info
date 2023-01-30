<script>
    export let exifData;
</script>

<div class="exif-info">
    <ul>
      <li>
        <span class="icon lens">lens</span>
        <!-- {exifData?.LensMake} -->
        {exifData?.LensModel}
      </li>
      <li>
        <span class="icon exposure">exposure</span>
        {exifData?.exposureTime}
      </li>

      <li>
        <span class="icon aperture">aperture</span>F {exifData?.FFNumber}
      </li>
      <li><span class="icon iso">ISO</span> {exifData?.ISO}</li>
    </ul>
</div>
<style>
    .exif-info {
    /* position: absolute;
    bottom: 25px;
    left: 5px; */

    color: #222;
    z-index: 33;
    text-align: center;
  }
  .exif-info ul {
    background-color: #c0c0c080;
    backdrop-filter: blur(3px);
    border-radius: 5px;
    padding: 0.25rem;
  }
  .exif-info li,
  .exif-info ul {
    display: inline-block;
  }
  .icon {
    display: inline-block;
    width: 25px;
    height: 25px;
    text-indent: -99999px;
    background-size: cover;
    margin: 0 5px;
    filter: contrast(0.5);
  }

  .aperture {
    background-image: url("/assets/icons8-aperture-50.png");
  }
  .iso {
    background-image: url("/assets/icons8-iso-50.png");
  }
  .exposure {
    background-image: url("/assets/icons8-exposure-50.png");
  }
  .lens {
    background-image: url("/assets/icons8-lens-50.png");
  }
  .info {
    background-image: url("/assets/icons8-info-50.png");
    cursor: pointer;
    transform: scale(0.75);
    filter: contrast(1);
    background-color: #eeeeee80;
    border-radius: 50%;
    margin: 0;
  }

</style>