
document.getElementById('downloadBtn').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the default download action

  // Show the custom modal
  document.getElementById('customModal').style.display = 'block';
});

document.getElementById('agreeBtn').addEventListener('click', function () {
  // If the user agrees, trigger the download
  document.getElementById('customModal').style.display = 'none'; // Close the modal
  window.location.href = document.getElementById('downloadBtn').href; // Trigger the download
});

document.getElementById('cancelBtn').addEventListener('click', function () {
  // If the user cancels, close the modal
  document.getElementById('customModal').style.display = 'none';
});

