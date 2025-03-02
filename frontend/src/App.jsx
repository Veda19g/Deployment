import { Signin } from "./components/Signin";
import { Signup } from "./components/Signup";
import { Home } from "./components/Home";
import  Dashboard  from "./components/Dashboard";
import  ElsevierPaperPage  from "./research/ElsevierPaperPage";
import ProfileForm from "./components/Profileform";
import TextEditor from "./components/TextEditor";
import Community from "./components/Discussions";
import Discussions from "./components/Community";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import ResearchComponent from "./research/search";
import Researchideas from "./components/Researchideas";
import Workspace from "./components/Workspace";
import ViewWorkspace from "./components/ViewWorkspace";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/elsevier/:scopusId" element={<ElsevierPaperPage />} />
        <Route path="/search" element={<ResearchComponent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collaborate" element={<Navigate to={`/documents/${uuidV4()}`} />} />
        <Route path="/documents/:id" element={<TextEditor />} />
        <Route path="/profile" element={<ProfileForm />} />   
        <Route path="/research-idea" element={<Researchideas/>}/>
        <Route path="/workspace" element={<Workspace/>}/>
        <Route path="/workspace/:workspaceId" element={<ViewWorkspace/>}/>
        <Route path="/discussions" element={<Discussions/>}/>
        <Route path="/community" element={<Community/>}/>
      </Routes>
    </Router>
  );
}

export default App;