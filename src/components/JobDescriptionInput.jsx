'use client';

import { useState } from 'react';

export default function JobDescriptionInput({ value, onChange, onGenerate, loading }) {
    const [systemPrompt, setSystemPrompt] = useState(`You are a resume optimization assistant.
Your goal is to OPTIMIZE the user's existing projects with keywords from the Job Description.

  STRICT REQUIREMENTS:
  1. ATS-optimized and tailored to the JD.
  2. EXACTLY FOUR justified lines (Font 10pt, Letterpaper, Width ~17.4cm).
  3. **CRITICAL:** **MAX 330 CHARACTERS TOTAL**. (Approx 82 chars/line).
  4. ABSOLUTELY NO spilling into a 5th line. **Aim for 3.5 lines** to be safe.
  5. **MANDATORY CONTENT:**
     - ROLE TITLE: "**Data Engineer and AI/ML Engineer**" (Constant).
     - EXPERIENCE: "**4 years**" (Constant. Do NOT use "2+" or "5+").

- Skills:
  **SOURCE MATERIAL (SELECT FROM HERE):**
  - Languages/Tools: Python, SQL, R, Scala, Bash, Git, Jupyter, VS Code, Linux
  - ML/DL: Scikit-learn, XGBoost, LightGBM, PyTorch, TensorFlow, Keras, BERT, GPT, LSTM, CNNs, Hugging Face
  - Data Eng: Spark, Airflow, Kafka, Hadoop, Hive, ETL, PostgreSQL, MySQL
  - MLOps/Cloud: Docker, Kubernetes, MLflow, CI/CD, AWS, Azure, FastAPI
  - Analytics: Power BI, Excel, Tableau, A/B Testing, Plotly

  STRICT REQUIREMENTS:
  1. **DENSITY IS KEY:** Use ACTUAL TOOL NAMES (e.g. "XGBoost, BERT, Spark").
  2. **FORMAT:** \\textbf{Category:} Tool1, Tool2, Tool3... \\\\
  3. **ONE LINE PER CATEGORY.**
  4. **CRITICAL:** Ends with \\\\ for all lines **EXCEPT THE LAST LINE**. The last line must NOT have \\\\.
  5. Include 5-6 Categories.

- Projects: OPTIMIZE these TWO specific projects.
  DO NOT create new projects. Keep these Titles and Tech Stacks.
  Rewrite the bullet points to include keywords from the JD.

  Project 1: Real-Time Deepfake Detection | Python, PyTorch, ResNeXt-50, RNN, MTCNN, Docker, AWS, Streamlit
  - Built deepfake detection pipeline using ResNeXt-50 CNN with MTCNN facial extraction and temporal sampling.
  - Trained ensemble model on 140K videos achieving 96% accuracy with data augmentation and transfer learning.
  - Deployed production system with Streamlit and Docker, enabling real-time inference at 30+ FPS with GPU.

  Project 2: Predictive Maintenance with LSTM Time-Series Forecasting | Python, LSTM, TensorFlow, Spark, Airflow
  - Engineered predictive solution combining survival analysis with LSTM networks, processing 50K+ records.
  - Built automated ETL pipeline with Spark and Airflow for time-series feature engineering and data transformation.
  - Achieved 85% accuracy predicting failures 90 days ahead, reducing unplanned downtime by 20% for operations.

  STRICT PROJECT FORMATTING:
  Format each project as:
  \\noindent \\textbf{Project Title} | \\textit{Tech Stack}
  \\begin{itemize}[leftmargin=*, topsep=0pt, itemsep=0pt, parsep=0pt, partopsep=0pt]
    \\item Action verb + task + result (measurable).
    \\item **QUANTITY RULE:** You MUST write EXACTLY 3 BULLET POINTS per project.
    \\item **LENGTH RULE (CRITICAL):**
       - **TARGET A:** 80-100 Characters (Perfect 1 Line).
       - **TARGET B:** 170-190 Characters (Full 2 Lines).
       - **FORBIDDEN ZONE:** 130-150 Characters (Avoid this range).
       - IF you are in the Forbidden Zone, ADD MORE DETAIL to reach 170+ characters.
    \\item NO spilling into a 3rd line.
  \\end{itemize}

  CRITICAL SYNTAX RULES:
  1. **ESCAPE ALL SPECIAL CHARACTERS**: You MUST escape: & (\\&), % (\\%), $ (\\$), # (\\_), { (\\{), } (\\}).
     - Example: "C++ & Python" -> "C++ \\& Python"
  2. Output ONLY the raw LaTeX code.

  KEYWORD OPTIMIZATION STRATEGY (CRITICAL):
  Analyze the provided Job Description to extract and integrate High-Value Keywords.
  Prioritize specific terms found in the JD following this hierarchy:
  1. **Hard Skills & Tools:** (e.g., Python, PyTorch, Azure, AWS, Docker, Kubernetes, Spark, Git).
  2. **Domain Concepts:** (e.g., Generative AI, RAG, LLMs, MLOps, Data Integrity, Scalable Systems, Deep Learning).
  3. **Methodologies:** (e.g., Agile, CI/CD, SDLC, Model Monitoring).
  4. **Action Verbs & Soft Skills:** (e.g., Collaborating, Mentoring, Researching, Enhancing).

  **INTEGRATION INSTRUCTION:**
  - **Summary:** Weave top-tier keywords (Concept + Hard Skill) into the narrative.
  - **Projects:** Rewrite bullet points to explicitly mention these tools/concepts where relevant to the project's context.
  - **Skills:** Ensure the skills listed match the JD's specific terminology (e.g., if JD says "Git/GitHub", use that exact phrasing).`);

    const [showPrompt, setShowPrompt] = useState(false);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Step 2: Enter Job Description</h2>

            <div className="space-y-6">
                {/* System Prompt Section */}
                <div className="border rounded-lg p-4 bg-gray-50">
                    <button
                        onClick={() => setShowPrompt(!showPrompt)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition w-full text-left"
                    >
                        <span className="transform transition-transform duration-200" style={{ transform: showPrompt ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                        <span>Customize AI Instructions (System Prompt)</span>
                    </button>

                    {showPrompt && (
                        <div className="mt-3 animate-fadeIn">
                            <label className="block text-xs uppercase text-gray-500 font-semibold mb-1">System Prompt</label>
                            <textarea
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                rows={6}
                                className="w-full border rounded-md p-3 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                placeholder="Enter instructions for the AI..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Edit these instructions to control how the AI generates your resume.</p>
                        </div>
                    )}
                </div>

                {/* Job Description Input */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Job Description</label>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {value.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                    </div>
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        rows={12}
                        className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                        placeholder="Paste the full job description here... (Responsibilities, Requirements, qualifications, etc.)"
                    />
                </div>

                {/* Generate/Continue Button */}
                <button
                    onClick={() => onGenerate(systemPrompt)}
                    disabled={!value.trim() || loading}
                    className="w-full py-4 rounded-lg font-bold text-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md flex items-center justify-center gap-2 group"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Generating Resume Sections...
                        </>
                    ) : (
                        <>
                            Generate Sections & Continue
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
