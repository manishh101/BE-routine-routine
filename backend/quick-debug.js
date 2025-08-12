const UnifiedPDFService = require('./services/UnifiedPDFService');

async function quickDebugTest() {
  try {
    console.log('🧪 Quick debug test for BCT-5-CD...');
    const pdfService = new UnifiedPDFService();
    
    // This will trigger the debug output
    await pdfService.generateClassSchedulePDF('BCT', 5, 'CD');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit(0);
}

// Connect to database first
require('./config/db');
setTimeout(quickDebugTest, 2000);
