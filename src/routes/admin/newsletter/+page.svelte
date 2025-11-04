<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';

  let subscribers = $state([]);
  let loading = $state(true);

  onMount(async () => {
    await fetchSubscribers();
  });

  async function fetchSubscribers() {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      subscribers = data;
    }
    loading = false;
  }
</script>

<div class="container mx-auto p-6">
  <Card>
    <CardHeader>
      <CardTitle>Newsletter Subscribers</CardTitle>
      <CardDescription>
        {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Subscribed</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each subscribers as subscriber}
            <TableRow>
              <TableCell class="font-medium">{subscriber.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{subscriber.source}</Badge>
              </TableCell>
              <TableCell class="text-muted-foreground">
                {new Date(subscriber.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge variant={subscriber.is_active ? 'default' : 'secondary'}>
                  {subscriber.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</div>