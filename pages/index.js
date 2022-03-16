import Head from 'next/head'

import Toast from '../class/Toast.class'

export default function Home() {

   function showToast() {
    new Toast({ position: "top-center", text: "Hello Right", showProgressBar: true  })
  }

  return (
    <div >
      <Head>
        <title>Toastify component</title>
      </Head> 

      <main >
       
         <button onClick={showToast}>Show Toast</button>
      </main>

    </div>
  )
}
