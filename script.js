
document.getElementById('downloadBtn').addEventListener('click', function (event) {
  event.preventDefault(); 
  document.getElementById('customModal').style.display = 'block';
});

document.getElementById('agreeBtn').addEventListener('click', function () {
  document.getElementById('customModal').style.display = 'none'; 
  window.location.href = document.getElementById('downloadBtn').href; 
});

document.getElementById('cancelBtn').addEventListener('click', function () {
  document.getElementById('customModal').style.display = 'none';
});

