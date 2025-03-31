document.addEventListener('keydown', function (e) {
  if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
  }
});

let buttonColor = 0;
let fontReversed = false;

function toggleButtonColor() {
  const body = document.body;
  const button = document.getElementById("mapMasterButton");
  const darkModeButton = document.getElementById("darkModeToggle");
  const menubuttons = document.querySelectorAll(".menubutton"); // Select all menu buttons

  if (buttonColor === 0) {
      darkModeButton.innerHTML = "☀️"; 
      body.style.backgroundColor = "#211e1e";
      body.style.color = "#e2e2e2";
      menubuttons.forEach(button => {
        button.style.backgroundColor = "#000";
        button.style.color = "#FFC30B";
        button.style.border = "2px solid #ffc308"; 

    });
      nameToggle.style.backgroundColor = "#000";
      nameToggle.style.color = "#FFC30B";
      nameToggle.style.border = "2px solid #ffc308"; 
      darkModeButton.style.backgroundColor = "#2bb3a5"; 
      darkModeButton.style.color = "#000"; 
      menu.style.backgroundColor = "#6d6e71"; 
      menu.style.color = "#FFC30B"; 
      buttonColor = 1; 
  } else {
    darkModeButton.innerHTML = "🌙"; 
      body.style.backgroundColor = "#fefefe";
      body.style.color = "#000000";

      menubuttons.forEach(button => {
        button.style.backgroundColor = "#FFC30B";
        button.style.color = "#000";
        button.style.border = "2px solidrgb(0, 0, 0)"; 

    });

      nameToggle.style.backgroundColor = "#FFC30B";
      nameToggle.style.color = "#000";
      nameToggle.style.border = "2px solid #ffc308"; 
      nameToggle.style.border = "2px solid #ffc308"; 

      darkModeButton.style.backgroundColor = "#000"; 
      darkModeButton.style.color = "#FFF"; 
      menu.style.backgroundColor = "#dfdcd5"; 
      menu.style.color = "#000000"; 
      buttonColor = 0; 
  }
}

function openResume() {
  const resumeURL = 'assets/Chetan_Tyagi_Resume.pdf'; 

  // Open the resume in a new tab
  window.open(resumeURL, '_blank');
}

