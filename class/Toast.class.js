const defaultOptions = {
  autoClose: 3000,
  position: "top-right",
  canClose: true,
  showProgressBar: true,
  onClose: () => {}
}

export default class Toast {
  #toastElement
  #autoCloseTimeout
  #progressInterval
  #autoClose
  #removeBinded
  #visibleSince

  constructor(options) {
    this.#toastElement = document.createElement("div")

    this.#toastElement.classList.add("toast")

    this.#visibleSince = new Date()

    requestAnimationFrame(() => {
      this.#toastElement.classList.add("show")
    })

    this.#removeBinded = this.remove.bind(this)

    this.update({...defaultOptions, ...options})

    Object.entries({...defaultOptions, ...options}).forEach(([ key, value ]) => {
      this[key] = value
    })
  }

  set position(value) {
    const currentContainer = this.#toastElement.parentElement
    const selector = `.toast-container[data-position="${value}"]`
    const container = document.querySelector(selector) || createToastContainer(value)
    container.append(this.#toastElement)
    if (currentContainer === null || currentContainer.hasChildNodes()) return
    currentContainer.remove()
  }

  set showProgressBar(value) {
    this.#toastElement.classList.toggle("progress", value)

    this.#toastElement.style.setProperty("--progress", 1)

    if (value) {
      this.#progressInterval = setInterval(() => {
        const timeVisible = new Date() - this.#visibleSince
        this.#toastElement.style.setProperty("--progress", 1 - timeVisible / this.#autoClose)
      }, 10)
    }
  }

  set autoClose(delay) {
    this.#autoClose = delay
    this.#visibleSince = new Date()
    if (delay === false) return 
    if (this.#autoCloseTimeout !== null) clearTimeout(this.#autoCloseTimeout)
    this.#autoCloseTimeout = setTimeout(() => {
      this.remove()
    }, delay) 
  }

  set text(value) {
    this.#toastElement.textContent = value
  }

  set canClose(value) { 
    this.#toastElement.classList.toggle("can-close", value)

    if (value) {
      this.#toastElement.addEventListener("click", this.#removeBinded) 
    } else {
      this.#toastElement.removeEventListener("click", this.#removeBinded)
    }
    
  }

  update(options) {
    Object.entries(options).forEach(([ key, value ]) => {
      this[key] = value
    })
  }

  remove() {
    clearTimeout(this.#autoCloseTimeout)
    clearInterval(this.#progressInterval)
    const container = this.#toastElement.parentElement
    this.#toastElement.classList.remove("show")
    this.#toastElement.addEventListener("transitionend", () => {
      this.#toastElement.remove()
      if  (container.hasChildNodes()) return 
      container.remove()
    })
    this.onClose()
  
  }
}

function createToastContainer(position) {
  const container = document.createElement(`div`)

  container.classList.add("toast-container")

  container.dataset.position = position

  document.body.append(container)

  return container
}