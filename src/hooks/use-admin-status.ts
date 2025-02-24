
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No session found - user is not logged in');
          setIsAdmin(false);
          return;
        }

        console.log('Session found for user:', session.user.id);
        console.log('Email:', session.user.email);
        
        // First check if we can even access the user_roles table
        const { data: testData, error: testError } = await supabase
          .from('user_roles')
          .select('*')
          .limit(1);
          
        console.log('Test query result:', { testData, testError });

        // Now try to get the specific user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', session.user.id);

        console.log('Role query result:', { roleData, roleError });

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          toast({
            title: "Error checking admin status",
            description: roleError.message,
            variant: "destructive",
          });
          setIsAdmin(false);
          return;
        }

        if (roleData && roleData.length > 0) {
          console.log('Found role data:', roleData);
          setIsAdmin(roleData[0].role === 'admin');
        } else {
          console.log('No role found for user');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Error checking admin status",
          description: "There was a problem checking your admin status. Please try refreshing the page.",
          variant: "destructive",
        });
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, loading };
};
