## Multimodal Chatbot

Multimodal chatbot that records audio and streams it to a server for processing. 

### Getting Started

To get started, clone the repository and run the following command:

1. Start the server
```
cd backend
```
```
python3 -m venv venv && source venv/bin/activate
```
```
pip install -r requirements.txt
```
```
uvicorn main:app --reload
```


2. Start the frontend
```
cd frontend
```
```
npm install
```
```
npm run dev
```

3. Open http://localhost:5173/ in your browser to see the frontend.

