-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
CREATE TYPE wallpaper_status AS ENUM ('pending', 'approved', 'rejected');

-- User roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  color VARCHAR(7) DEFAULT '#6B7280',
  priority INTEGER DEFAULT 0,
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role_name VARCHAR(50) REFERENCES user_roles(name) DEFAULT 'user',
  status user_status DEFAULT 'active',
  bio TEXT,
  website VARCHAR(255),
  social_links JSONB DEFAULT '{}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  onboarding_completed BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP WITH TIME ZONE,
  uploads_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  wallpapers_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallpapers table
CREATE TABLE wallpapers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  uploader_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  original_filename VARCHAR(255),
  file_size BIGINT,
  dimensions JSONB,
  resolution VARCHAR(20),
  tags TEXT[],
  status wallpaper_status DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT false,
  has_watermark BOOLEAN DEFAULT false,
  downloads_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table
CREATE TABLE wallpaper_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallpaper_id UUID REFERENCES wallpapers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallpaper_id, user_id)
);

-- Comments table
CREATE TABLE wallpaper_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallpaper_id UUID REFERENCES wallpapers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES wallpaper_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Downloads tracking table
CREATE TABLE wallpaper_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallpaper_id UUID REFERENCES wallpapers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User onboarding steps table
CREATE TABLE user_onboarding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  step_name VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, step_name)
);

-- Insert default roles
INSERT INTO user_roles (name, display_name, description, permissions, color, priority, is_system_role) VALUES
('admin', 'Administrator', 'Full system access with all permissions', 
 '["system_admin", "manage_users", "manage_roles", "manage_wallpapers", "manage_settings", "view_analytics", "moderate_comments"]'::jsonb, 
 '#DC2626', 100, true),
('moderator', 'Moderator', 'Can moderate content and manage users', 
 '["manage_wallpapers", "moderate_comments", "view_users", "approve_wallpapers"]'::jsonb, 
 '#F59E0B', 50, true),
('contributor', 'Contributor', 'Can upload and manage own wallpapers', 
 '["upload_wallpapers", "manage_own_wallpapers", "comment_wallpapers"]'::jsonb, 
 '#10B981', 25, true),
('user', 'User', 'Basic user with download and voting permissions', 
 '["download_wallpapers", "vote_wallpapers", "comment_wallpapers"]'::jsonb, 
 '#6B7280', 10, true);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
('Nature', 'nature', 'Beautiful nature and landscape wallpapers', 'FiSun', 1),
('Abstract', 'abstract', 'Modern abstract and artistic designs', 'FiZap', 2),
('Urban', 'urban', 'City and urban photography', 'FiMapPin', 3),
('Space', 'space', 'Space and astronomy wallpapers', 'FiGlobe', 4),
('Minimal', 'minimal', 'Clean and minimal designs', 'FiSquare', 5),
('Technology', 'technology', 'Tech and digital art wallpapers', 'FiCpu', 6);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallpaper_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallpaper_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallpaper_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for wallpapers
CREATE POLICY "Anyone can view approved wallpapers" ON wallpapers FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can upload wallpapers" ON wallpapers FOR INSERT WITH CHECK (auth.uid() = uploader_id);
CREATE POLICY "Users can update own wallpapers" ON wallpapers FOR UPDATE USING (auth.uid() = uploader_id);

-- RLS Policies for votes
CREATE POLICY "Users can view all votes" ON wallpaper_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote on wallpapers" ON wallpaper_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON wallpaper_votes FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Users can view approved comments" ON wallpaper_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can add comments" ON wallpaper_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON wallpaper_comments FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for downloads
CREATE POLICY "Users can view own downloads" ON wallpaper_downloads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can track downloads" ON wallpaper_downloads FOR INSERT WITH CHECK (true);

-- RLS Policies for onboarding
CREATE POLICY "Users can view own onboarding" ON user_onboarding FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own onboarding" ON user_onboarding FOR ALL USING (auth.uid() = user_id);

-- Functions and Triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Function to update wallpaper rating
CREATE OR REPLACE FUNCTION update_wallpaper_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE wallpapers 
  SET 
    rating_average = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM wallpaper_votes 
      WHERE wallpaper_id = NEW.wallpaper_id
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM wallpaper_votes 
      WHERE wallpaper_id = NEW.wallpaper_id
    )
  WHERE id = NEW.wallpaper_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for rating updates
DROP TRIGGER IF EXISTS on_vote_change ON wallpaper_votes;
CREATE TRIGGER on_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON wallpaper_votes
  FOR EACH ROW EXECUTE PROCEDURE update_wallpaper_rating();

-- Function to update category wallpaper count
CREATE OR REPLACE FUNCTION update_category_count()
RETURNS trigger AS $$
BEGIN
  -- Update old category count
  IF OLD.category_id IS NOT NULL THEN
    UPDATE categories 
    SET wallpapers_count = wallpapers_count - 1 
    WHERE id = OLD.category_id;
  END IF;
  
  -- Update new category count
  IF NEW.category_id IS NOT NULL THEN
    UPDATE categories 
    SET wallpapers_count = wallpapers_count + 1 
    WHERE id = NEW.category_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for category count updates
DROP TRIGGER IF EXISTS on_wallpaper_category_change ON wallpapers;
CREATE TRIGGER on_wallpaper_category_change
  AFTER INSERT OR UPDATE OF category_id ON wallpapers
  FOR EACH ROW EXECUTE PROCEDURE update_category_count();

-- Indexes for performance
CREATE INDEX idx_wallpapers_status ON wallpapers(status);
CREATE INDEX idx_wallpapers_category ON wallpapers(category_id);
CREATE INDEX idx_wallpapers_uploader ON wallpapers(uploader_id);
CREATE INDEX idx_wallpapers_featured ON wallpapers(is_featured);
CREATE INDEX idx_wallpapers_created_at ON wallpapers(created_at DESC);
CREATE INDEX idx_user_profiles_role ON user_profiles(role_name);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_wallpaper_votes_wallpaper ON wallpaper_votes(wallpaper_id);
CREATE INDEX idx_wallpaper_comments_wallpaper ON wallpaper_comments(wallpaper_id);
CREATE INDEX idx_wallpaper_downloads_wallpaper ON wallpaper_downloads(wallpaper_id);