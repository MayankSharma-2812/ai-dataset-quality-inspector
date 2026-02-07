import { useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"

function App() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!file) return
    setLoading(true)

    const form = new FormData()
    form.append("file", file)

    const res = await axios.post(
      "http://127.0.0.1:8000/inspect",
      form
    )

    setResult(res.data)
    setLoading(false)
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        AI Dataset Quality Inspector
      </motion.h1>

      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
      />

      <button onClick={analyze} style={{ marginLeft: 10 }}>
        Analyze
      </button>

      {loading && <p>Analyzing dataset…</p>}

      {result && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default App
