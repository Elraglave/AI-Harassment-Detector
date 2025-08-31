# 🛡️ Anti-Harassment Shield - AI-Powered Legal Protection

A comprehensive anti-street harassment platform that combines voice recording, AI-powered analysis, and Australian NSW law guidance to help victims document incidents and understand their legal rights.

## 🌟 **Project Overview**

**Anti-Harassment Shield** is an innovative web application designed to combat street harassment through technology and legal education. Built with cutting-edge AI analysis and comprehensive NSW law integration, it empowers victims to document incidents, understand their legal rights, and take appropriate action.

## 🚀 **Key Features**

### 🎙️ **Voice Recording & Documentation**
- **Real-time Audio Recording**: Capture harassment incidents as they happen
- **Incident Details**: Document date, location, and detailed descriptions
- **Audio Playback**: Review recordings for accuracy and completeness
- **Secure Storage**: Local storage of incident reports and audio files

### 🔍 **AI-Powered Analysis**
- **Harassment Detection**: Advanced AI analysis of incident descriptions
- **Severity Assessment**: Automatic classification of harassment types and severity
- **Keyword Identification**: Detection of offensive language and threatening content
- **Confidence Scoring**: AI confidence levels for analysis accuracy

### ⚖️ **NSW Legal Framework**
- **Comprehensive Law Coverage**: Crimes Act 1900, Anti-Discrimination Act 1977, Summary Offences Act 1988
- **Legal Definitions**: Clear explanations of harassment types under NSW law
- **Punishment Guidelines**: Potential legal consequences and penalties
- **Resource Links**: Direct access to official NSW legal resources

### 🛡️ **Protection & Empowerment**
- **Incident Reporting**: Structured documentation for legal proceedings
- **Legal Guidance**: Step-by-step advice on next steps
- **Resource Directory**: Links to legal aid, police, and support services
- **Educational Content**: Understanding your rights and legal protections

## 🏗️ **Architecture & Technology**

### **Frontend Framework**
- **Next.js 14**: Modern React framework with App Router
- **TypeScript**: Type-safe development and better code quality
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Beautiful, consistent icon library

### **AI Integration**
- **Ollama Integration**: Local AI model processing for privacy
- **Llama2 Model**: Advanced language model for harassment analysis
- **Fallback Systems**: Keyword-based analysis when AI is unavailable
- **Real-time Processing**: Instant analysis and feedback

### **Audio Processing**
- **MediaRecorder API**: Browser-based audio recording
- **Blob Storage**: Efficient audio file handling
- **Playback Controls**: Full audio review capabilities
- **Format Support**: WAV format for compatibility

## 📱 **User Interface**

### **Three-Column Layout**
1. **🎙️ Record Incident**: Voice recording with incident details
2. **🔍 AI Analysis**: Real-time harassment detection and analysis
3. **⚖️ Legal Guidance**: NSW law information and legal resources

### **Responsive Design**
- **Mobile-First**: Optimized for smartphone use during incidents
- **Accessibility**: High contrast and clear typography
- **Intuitive Navigation**: Easy-to-use interface in stressful situations
- **Dark Theme**: Professional appearance with red-to-purple gradient

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ and npm
- Ollama with Llama2 model installed
- Modern web browser with microphone support

### **Installation**

1. Navigate to the nextjs-app directory:
```bash
cd nextjs-app
```

2. Install dependencies:
```bash
npm install
```

3. Start Ollama with Llama2 model:
```bash
ollama run llama2
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📋 **Usage Guide**

### **Recording an Incident**
1. **Fill Details**: Enter date, location, and incident description
2. **Start Recording**: Click "Start Recording" and describe what happened
3. **Stop Recording**: End recording when finished
4. **Save Report**: Click "Save Incident Report" to store the incident

### **AI Analysis**
1. **Input Text**: Paste incident description or transcribed audio
2. **Analyze**: Click "Analyze Incident" for AI-powered detection
3. **Review Results**: Check harassment type, severity, and confidence
4. **Understand Implications**: Review legal implications and recommendations

### **Legal Guidance**
1. **Select Type**: Choose harassment type from dropdown
2. **Review Law**: Read relevant NSW legislation and definitions
3. **Check Penalties**: Understand potential legal consequences
4. **Access Resources**: Use provided links for further assistance

## ⚖️ **Legal Framework**

### **NSW Laws Covered**
- **Crimes Act 1900**: Criminal offenses and penalties
- **Anti-Discrimination Act 1977**: Discrimination and harassment
- **Summary Offences Act 1988**: Minor offenses and public order
- **Common Law**: Precedent-based legal principles

### **Harassment Types**
- **Verbal Harassment**: Offensive language and slurs
- **Sexual Harassment**: Unwelcome sexual advances and comments
- **Stalking**: Following and unwanted surveillance
- **Intimidation**: Threatening behavior and gestures

### **Legal Consequences**
- **Fines**: Up to $5,500 for various offenses
- **Imprisonment**: Up to 5 years for serious harassment
- **Compensation**: Up to $100,000 for discrimination cases
- **Restraining Orders**: Court-ordered protection measures

## 🔒 **Privacy & Security**

### **Data Protection**
- **Local Storage**: All data stored locally in your browser
- **No Cloud Uploads**: Audio and incident data never leaves your device
- **Secure Recording**: Direct microphone access without external services
- **User Control**: Complete control over your incident reports

### **Legal Compliance**
- **NSW Law Adherence**: Built around Australian legal framework
- **Evidence Standards**: Documentation suitable for legal proceedings
- **Professional Use**: Designed for law enforcement and legal professionals
- **Educational Purpose**: Information provided for educational use only

## 🛠️ **Development & Customization**

### **Project Structure**
```
nextjs-app/
├── app/
│   ├── api/
│   │   └── analyze-harassment/     # AI harassment analysis
│   ├── components/
│   │   ├── voice-recorder.tsx      # Audio recording component
│   │   ├── incident-analyzer.tsx   # AI analysis interface
│   │   └── legal-guidance.tsx      # Legal information display
│   ├── globals.css                 # Global styles and theme
│   ├── layout.tsx                  # Root layout component
│   └── page.tsx                    # Main application page
├── package.json                    # Dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

### **Customization Options**
- **Legal Framework**: Adapt for other Australian states or countries
- **AI Models**: Integrate different AI services or models
- **UI Theme**: Customize colors, layout, and branding
- **Features**: Add incident tracking, reporting, or community features

## 📚 **Legal Resources**

### **Official NSW Resources**
- [NSW Legislation Database](https://www.legislation.nsw.gov.au/)
- [Legal Aid NSW](https://www.legalaid.nsw.gov.au/)
- [Anti-Discrimination NSW](https://www.antidiscrimination.nsw.gov.au/)

### **Emergency Contacts**
- **Police**: 000 (Emergency) / 131 444 (Non-emergency)
- **Crime Stoppers**: 1800 333 000
- **1800RESPECT**: 1800 737 732 (Domestic violence support)

## ⚠️ **Important Disclaimers**

### **Legal Advice**
This platform provides educational information only and does not constitute legal advice. For specific legal guidance, consult with a qualified legal professional.

### **Emergency Situations**
In case of immediate danger or emergency, contact the police immediately by calling 000.

### **Evidence Standards**
While this platform helps document incidents, the admissibility of evidence in legal proceedings depends on various factors. Consult with legal professionals for guidance.

## 🌟 **Future Enhancements**

### **Planned Features**
- **Community Reporting**: Anonymous incident mapping
- **Legal Document Generation**: Automated report creation
- **Mobile App**: Native iOS and Android applications
- **Multi-language Support**: Support for diverse communities
- **Integration APIs**: Connect with law enforcement systems

### **AI Improvements**
- **Multi-language Analysis**: Support for various languages
- **Context Understanding**: Better situational awareness
- **Pattern Recognition**: Identify repeat offenders
- **Risk Assessment**: Predictive analysis of dangerous situations

---

**Empower yourself with knowledge, document incidents with technology, and understand your rights under NSW law. Together, we can create safer communities for everyone.** 🛡️✨ 