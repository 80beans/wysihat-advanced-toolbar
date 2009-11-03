require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

TOOLBAR_ROOT          = File.expand_path(File.dirname(__FILE__))
TOOLBAR_SRC_DIR       = File.join(TOOLBAR_ROOT, 'src')
TOOLBAR_DIST_DIR      = File.join(TOOLBAR_ROOT, 'dist')

task :default => :dist

desc "Builds the distribution."
task :dist => ["sprocketize:toolbar"]

namespace :sprocketize do
  task :dist_dir do
    FileUtils.mkdir_p(TOOLBAR_DIST_DIR)
  end
  
  task :toolbar => [:dist_dir] do
    require File.join(TOOLBAR_ROOT, "vendor", "sprockets", "lib", "sprockets")
    
    secretary = Sprockets::Secretary.new(
      :root         => File.join(TOOLBAR_ROOT, "src"),
      :load_path    => [TOOLBAR_SRC_DIR],
      :source_files => ["wysihat/advanced_toolbar.js"]
    )
    
    secretary.concatenation.save_to(File.join(TOOLBAR_DIST_DIR, "wysihat.advanced_toolbar.js"))
    
  end
end