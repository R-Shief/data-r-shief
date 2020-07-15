document.getElementById("blogSubmit").onsubmit = function() {
  var file = document.getElementById("blogSubmitFile").files[0];
  var formData = new FormData();
  formData.append("file", file);
  console.log(document.getElementById("blogSubmitFile").files[0]);
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      var response = this.responseText;
      document.getElementById("content").innerHTML = response;
    }
  }
  request.open('POST', '/blog/submit');
  request.setRequestHeader("Content-type", "application/multipart/form-data");
  request.send(formData);
  return false; // prevents reload
}
