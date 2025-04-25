// Load previous session count from localStorage (or set to 0)
let notificationCount = parseInt(localStorage.getItem('notificationCount')) || 0

// Show the initial count
document.getElementById(
  'counter'
).innerText = `Notifications sent: ${notificationCount}`

document.getElementById('notifyBtn').addEventListener('click', () => {
  const title = document.getElementById('title').value || 'Notification Alert'
  const message = document.getElementById('message').value
  const icon =
    document.getElementById('icon').value ||
    'https://emojiapi.dev/api/v1/bell/128.png'

  if (!message.trim()) {
    alert('Please enter a message.')
    return
  }

  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        triggerNotification(title, message, icon)
      } else {
        alert('Notification permission denied.')
      }
    })
  } else {
    triggerNotification(title, message, icon)
  }
})

function triggerNotification(title, message, icon) {
  setTimeout(() => {
    new Notification(title, {
      body: message,
      icon: icon,
    })

    // Increment & store count
    notificationCount++
    localStorage.setItem('notificationCount', notificationCount)
    document.getElementById(
      'counter'
    ).innerText = `Notifications sent: ${notificationCount}`
  }, 5000)
}
