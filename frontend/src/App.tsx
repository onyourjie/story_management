import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import StoryList from "./pages/StoryList";
import StoryForm from "./pages/StoryForm";
import ChapterForm from "./pages/ChapterForm";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stories" element={<StoryList />} />
          <Route path="/stories/add" element={<StoryForm mode="add" />} />
          <Route path="/stories/:id" element={<StoryForm mode="detail" />} />
          <Route path="/stories/:id/edit" element={<StoryForm mode="edit" />} />
          <Route
            path="/stories/:id/chapters/add"
            element={<ChapterForm mode="add" />}
          />
          <Route
            path="/stories/:id/chapters/:chapterId/edit"
            element={<ChapterForm mode="edit" />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

//tes