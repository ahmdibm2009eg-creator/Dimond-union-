import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { projects as seedProjects } from '@/lib/translations';
import { base44 } from '@/api/base44Client';
import { Images, Lock, Pencil, Plus, Trash2, Type } from 'lucide-react';
import ProjectLightbox from '@/components/ProjectLightbox';
import ProjectImageEditor from '@/components/ProjectImageEditor';
import ProjectCreateModal from '@/components/ProjectCreateModal';
import ContentEditorModal from '@/components/ContentEditorModal';
import ScrollReveal from '@/components/ScrollReveal';

const normalizeProject = (p) => ({
  id: p.id,
  name: { ar: p.name_ar || p.name?.ar || '', en: p.name_en || p.name?.en || '' },
  category: p.category,
  images: p.images || [],
  thumb: (p.images || [])[0]
});

export default function Portfolio() {
  const { t, lang, reloadContent } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [creatingProject, setCreatingProject] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [entityProjects, setEntityProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const data = await base44.entities.Project.list('order');
      setEntityProjects(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const projects = (entityProjects.length > 0 ? entityProjects : seedProjects).map(normalizeProject);

  const categories = [
  { key: 'all', label: t.portfolio.categories.all },
  { key: 'stands', label: t.portfolio.categories.stands },
  { key: 'exhibition', label: t.portfolio.categories.exhibition },
  { key: 'interior', label: t.portfolio.categories.interior },
  { key: 'signage', label: t.portfolio.categories.signage }];


  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  const handlePassword = (e) => {
    e.preventDefault();
    if (passwordInput === '1516') {
      setAdminMode(true);
      setShowPasswordPrompt(false);
      setPasswordInput('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleDeleteProject = async (project) => {
    const confirmMsg = lang === 'ar'
      ? `هل أنت متأكد من حذف مشروع "${project.name[lang] || project.name.ar}"؟`
      : `Are you sure you want to delete "${project.name[lang] || project.name.en}"?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      await base44.entities.Project.delete(project.id);
      loadProjects();
    } catch (err) {
      console.error(err);
      window.alert(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting');
    }
  };

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-primary"></div>
            <span className="text-primary text-sm font-semibold tracking-wide uppercase">
              {t.portfolio.title}
            </span>
            <div className="w-8 h-0.5 bg-primary"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.portfolio.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.portfolio.subtitle}</p>
        </ScrollReveal>

        <div className="flex flex-wrap justify-center gap-3 mb-10 items-center">
          {categories.map((cat) =>
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            filter === cat.key ?
            'bg-primary text-white shadow-md' :
            'bg-accent text-foreground hover:bg-accent/80'}`
            }>
            
              {cat.label}
            </button>
          )}
          <button
            onClick={() => adminMode ? setAdminMode(false) : setShowPasswordPrompt(true)}
            className={`ms-2 p-2 rounded-full transition-all opacity-0 ${adminMode ? 'bg-primary text-white' : 'text-muted-foreground hover:text-primary'}`}
            title={adminMode ? lang === 'ar' ? 'إنهاء التحرير' : 'Exit Edit' : lang === 'ar' ? 'تحرير الصور' : 'Edit Images'}>
            
            {adminMode ? <Lock size={18} /> : <Pencil size={18} />}
          </button>
          {adminMode &&
          <>
              <button
              onClick={() => setCreatingProject(true)}
              className="ms-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
              
                <Plus size={16} />
                {lang === 'ar' ? 'مشروع جديد' : 'New Project'}
              </button>
              <button
              onClick={() => setEditingContent(true)}
              className="ms-2 px-4 py-2 rounded-full bg-foreground text-white text-sm font-medium hover:bg-foreground/90 transition-colors flex items-center gap-1.5">
              
                <Type size={16} />
                {lang === 'ar' ? 'تعديل النصوص' : 'Edit Texts'}
              </button>
            </>
          }
        </div>

        {showPasswordPrompt &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowPasswordPrompt(false)}>
            <form onSubmit={handlePassword} className="bg-card rounded-2xl p-8 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-foreground">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</h3>
              </div>
              <input
              type="password"
              value={passwordInput}
              onChange={(e) => {setPasswordInput(e.target.value);setPasswordError(false);}}
              autoFocus
              className={`w-full px-4 py-3 rounded-lg border ${passwordError ? 'border-destructive' : 'border-input'} bg-background text-foreground`}
              placeholder={lang === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'} />
            
              {passwordError && <p className="text-destructive text-sm mt-2">{lang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password'}</p>}
              <button type="submit" className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                {lang === 'ar' ? 'دخول' : 'Enter'}
              </button>
            </form>
          </div>
        }

        {loading ?
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-accent border-t-primary rounded-full animate-spin"></div>
          </div> :

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) =>
          <ScrollReveal key={project.id} delay={i % 3 * 0.1}>
                <div
              onClick={() => !adminMode && setSelectedProject(project)}
              className={`diamond-frame group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out ${adminMode ? 'cursor-default' : 'cursor-pointer'}`}>
              
                  <div className="relative h-64 overflow-hidden">
                    <img
                  src={project.thumb || project.images?.[0]}
                  alt={project.name[lang]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent"></div>
                    <span className="absolute top-4 start-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                      {t.portfolio.categories[project.category]}
                    </span>
                    {project.images && project.images.length > 1 &&
                <span className="absolute top-4 end-4 flex items-center gap-1 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                        <Images size={12} />
                        {project.images.length}
                      </span>
                }
                    {!adminMode &&
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/30">
                        <div className="bg-white rounded-full p-3 shadow-lg">
                          <Images size={22} className="text-primary" />
                        </div>
                      </div>
                }
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{project.name[lang]}</h3>
                    {adminMode &&
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {e.stopPropagation();setEditingProject(project);}}
                    className="bg-primary text-white rounded-full p-2 hover:bg-primary/90 transition-colors"
                    title={lang === 'ar' ? 'تعديل الصور' : 'Edit Images'}>
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={(e) => {e.stopPropagation();handleDeleteProject(project);}}
                    className="bg-destructive text-white rounded-full p-2 hover:bg-destructive/90 transition-colors"
                    title={lang === 'ar' ? 'حذف المشروع' : 'Delete Project'}>
                    <Trash2 size={16} />
                  </button>
                </div>
                }
                  </div>
                </div>
              </ScrollReveal>
          )}
          </div>
        }
      </div>

      {selectedProject &&
      <ProjectLightbox project={selectedProject} onClose={() => setSelectedProject(null)} />
      }

      {editingProject &&
      <ProjectImageEditor
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onUpdate={loadProjects} />

      }

      {creatingProject &&
      <ProjectCreateModal
        onClose={() => setCreatingProject(false)}
        onCreated={loadProjects} />

      }

      {editingContent &&
      <ContentEditorModal
        onClose={() => setEditingContent(false)}
        onUpdated={reloadContent} />

      }
    </section>);

}