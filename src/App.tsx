import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ScrollToTop } from './components/ScrollToTop';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CoursesPage } from './pages/CoursesPage';
import { DashboardPage } from './pages/DashboardPage';
import { LessonPage } from './pages/LessonPage';
import { ModulePage } from './pages/ModulePage';
import { ProfilePage } from './pages/ProfilePage';
import { ProgressPage } from './pages/ProgressPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { QuizPage } from './pages/QuizPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <AppShell>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/courses/:courseId/modules/:moduleId" element={<ModulePage />} />
        <Route path="/lessons/:lessonId" element={<LessonPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
