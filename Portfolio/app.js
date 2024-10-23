
        document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.key === 'u' || e.key === 'U') {
        e.preventDefault();

      }
    });
    let buttonColor = 0; // 0 for initial colors, 1 for swapped colors
    let fontReversed = false;

    function toggleButtonColor() {
        const body = document.body;
        const button = document.getElementById("mapMasterButton");

        if (buttonColor === 0) {
            // Change to swapped colors and reverse the font
            body.style.backgroundColor = "#3e424b";
            body.style.color = "#FFC30B";
            menu.style.backgroundColor= "#6d6e71";
            button.style.backgroundColor = "#FFC30B";
            button.style.color = "#000000";
            fontReversed = true;
            buttonColor = 1;
        } else {
            // Change back to initial colors and restore the font
            body.style.backgroundColor = "#faf6ea";
            body.style.color = "#000000";
            menu.style.backgroundColor= "#dfdcd5";
            button.style.backgroundColor = "#FFC30B";
            button.style.color = "#000000";
            fontReversed = false;
            buttonColor = 0;
        }

        // Toggle the font style

    }

    function openResume() {
        // Replace 'resume.pdf' with the actual path to your resume
        const resumeURL = 'assets/Chetan_Tyagi_Resume.pdf'; 
    
        // Open the resume in a new tab
        window.open(resumeURL, '_blank');
    }
