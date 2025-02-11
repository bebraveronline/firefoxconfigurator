// Create elements safely without innerHTML
function createSvgIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'w-6 h-6 flex-shrink-0 mt-0.5');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('viewBox', '0 0 24 24');
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('d', 'M5 13l4 4L19 7');
  
  svg.appendChild(path);
  return svg;
}

const nextSteps = [
  'Consider leaving a review to help others find this extension',
  'Share this extension with friends and colleagues who care about their privacy',
  'Disable or remove this extension when not in use to keep your browser lean'
];

document.addEventListener('DOMContentLoaded', () => {
  const nextStepsList = document.getElementById('next-steps');
  if (nextStepsList) {
    nextSteps.forEach(step => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2';
      
      const icon = createSvgIcon();
      const textSpan = document.createElement('span');
      textSpan.textContent = step;
      
      li.appendChild(icon);
      li.appendChild(textSpan);
      nextStepsList.appendChild(li);
    });
  }
});