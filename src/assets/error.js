const troubleshootingSteps = [
  'Ensure the user.js file is in your browser profile directory',
  'The file should be directly in the profile folder, not in any subdirectory',
  'Restart your browser completely (close all windows and start again)',
  'Try downloading and applying the settings again'
];

const profileSteps = [
  'Open a new tab',
  'Type about:support in the address bar',
  'Look for "Profile Directory" and click "Open Directory"',
  'Place the user.js file in this folder'
];

document.addEventListener('DOMContentLoaded', () => {
  const troubleshootingList = document.getElementById('troubleshooting-steps');
  if (troubleshootingList) {
    troubleshootingSteps.forEach(step => {
      const li = document.createElement('li');
      const text = document.createTextNode(step);
      li.appendChild(text);
      troubleshootingList.appendChild(li);
    });
  }

  const profileList = document.getElementById('profile-steps');
  if (profileList) {
    profileSteps.forEach((step, index) => {
      const li = document.createElement('li');
      const text = document.createTextNode(`${index + 1}. ${step}`);
      li.appendChild(text);
      profileList.appendChild(li);
    });
  }

  const retryButton = document.getElementById('retryButton');
  if (retryButton) {
    retryButton.addEventListener('click', () => {
      window.close();
    });
  }
});