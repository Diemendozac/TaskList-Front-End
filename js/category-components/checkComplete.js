const checkComplete = () => {
  const i = document.createElement('i');
  i.classList.add('uil', 'uil-search', 'icon');
  i.addEventListener('click', completeTask);
  return i;
};
// Immediately invoked function expression IIFE
const completeTask = (event) => {
  const element = event.target;
  alert("Hola mundo");
  
};

export default checkComplete;