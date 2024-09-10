
  
window.onscroll = () => {
    if (window.pageYOffset > 50)
    {
      document.getElementById("top-header").classList.add("top-header--white--background");
    } else
    {
      document.getElementById("top-header").classList.remove("top-header--white--background");
    }
  }

  document.getElementById('adventure-button').addEventListener('click', function () {
  document.getElementById('video-container').style.display = 'flex';
});


