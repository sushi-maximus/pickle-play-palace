
import { AppLayout } from "@/components/layout/AppLayout";

const Privacy = () => {
  return (
    <AppLayout title="Privacy Policy">
      <div className="py-4">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p>
            <strong>Last Updated: May 21, 2025</strong>
          </p>
          <p>
            At Pickle Ninja, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
          </p>
          
          <h2>Information We Collect</h2>
          <p>We collect the following information when you create an account and use our services:</p>
          <ul>
            <li>Name, email address, and other contact information</li>
            <li>Account login credentials</li>
            <li>Profile information (gender, skill level, birthday, DUPR rating)</li>
            <li>Profile pictures and other media you upload</li>
            <li>Game history, scores, and performance statistics</li>
            <li>Communications through our platform</li>
            <li>Device information and usage data</li>
          </ul>
          
          <h2>How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Match you with appropriate players and events</li>
            <li>Process payments for tournaments and events</li>
            <li>Communicate with you about our services</li>
            <li>Ensure the security of your account</li>
            <li>Analyze usage patterns to improve the platform</li>
          </ul>
          
          <h2>Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Other users as part of the normal functioning of the platform</li>
            <li>Service providers who help us operate our platform</li>
            <li>Legal authorities when required by law</li>
          </ul>
          <p>We never sell your personal information to third parties.</p>
          
          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. We use industry-standard encryption and data protection practices.
          </p>
          
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your data</li>
            <li>Object to certain processing activities</li>
            <li>Export your data</li>
          </ul>
          <p>To exercise these rights, please contact us at privacy@pickleninja.com.</p>
          
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@pickleninja.com.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Privacy;
