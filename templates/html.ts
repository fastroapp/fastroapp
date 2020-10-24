export const html = `<html>

<head>
  <style>
    html,
    body {
      height: 100%;
      margin: 0;
      padding: 0;
      font-family: Roboto, Helvetica, Arial, sans-serif;
      background: #ECEFF1;
      color: rgba(0, 0, 0, 0.87);
    }

    div {
      position: relative;
      height: 100%;
      width: 100%;
    }

    div #ctnr {
      text-align: center;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 200;
      height: 90;
      border-radius: 3px;
      background-color: white;
      padding: 20;
    }

    #ctnr {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }

    .loader {
      font-size: 10px;
      margin: auto auto;
      text-indent: -9999em;
      width: 5em;
      height: 5em;
      border-radius: 50%;
      background: #ffffff;
      background: -moz-linear-gradient(left, #000000 10%, rgba(255, 255, 255, 0) 42%);
      background: -webkit-linear-gradient(left, #000000 10%, rgba(255, 255, 255, 0) 42%);
      background: -o-linear-gradient(left, #000000 10%, rgba(255, 255, 255, 0) 42%);
      background: -ms-linear-gradient(left, #000000 10%, rgba(255, 255, 255, 0) 42%);
      background: linear-gradient(to right, #000000 10%, rgba(255, 255, 255, 0) 42%);
      position: relative;
      -webkit-animation: load3 1.4s infinite linear;
      animation: load3 1.4s infinite linear;
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
    }

    .loader:before {
      width: 50%;
      height: 50%;
      background: #000000;
      border-radius: 100% 0 0 0;
      position: absolute;
      top: 0;
      left: 0;
      content: '';
    }

    .loader:after {
      background: #ffffff;
      width: 75%;
      height: 75%;
      border-radius: 50%;
      content: '';
      margin: auto;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    @-webkit-keyframes load3 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }

      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @keyframes load3 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }

      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
  </style>
</head>

<body>
  <div>
    <div id="ctnr">
      <div id="ldr" class="loader">Loading...</div>
      <img id="logo" src="logo.svg" width="100" style="margin: auto;">
      <div id="msg" style="margin-top:10">Loading ... </div>
    </div>
  </div>
</body>
<script>
  document.getElementById("logo").style.display = "none";
  async function get() {
    const data = await fetch("/hello");
    const d = await data.text();
    if (d) {
      document.getElementById("ldr").remove();
      document.getElementById("logo").style.display = "block";
      document.getElementById("msg").innerHTML = d;
    }
  }
  get();
</script>

</html>
`;
