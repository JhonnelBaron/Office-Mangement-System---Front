import Pusher from 'pusher-js';

export default ({ app }, inject) => {
  // Set up Pusher
  const pusher = new Pusher('3d3383452fb5db324a27', {
    cluster: 'ap1',
  });

  // Inject it into the context as $pusher
  inject('pusher', pusher);
};
