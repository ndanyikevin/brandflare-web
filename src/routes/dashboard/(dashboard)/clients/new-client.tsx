import { createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { api } from "~/lib/api";
import { 
  ChevronLeft, 
  UserPlus, 
  Save, 
  Loader2,
  Building2,
  Contact2,
  MapPinned
} from "lucide-solid";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function NewClientPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await api.clients.$post({
        json: {
          name: data.name as string,
          email: data.email as string,
          phone: data.phone as string,
          poBox: data.poBox as string,
          postalCode: data.postalCode as string,
          city: data.city as string,
          country: data.country as string,
        }
      });

      if (res.ok) {
        const newClient = await res.json();
        navigate(`/dashboard/clients/${newClient.id}`);
      }
    } catch (err) {
      console.error("Failed to create client:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/dashboard/clients")}
            class="h-8 px-2 lg:px-3"
          >
            <ChevronLeft class="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 class="text-3xl font-bold tracking-tight">Add New Client</h2>
        </div>
      </div>

      <Separator />

      <div class="flex justify-center py-6">
        <Card class="w-full max-w-2xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <div class="flex items-center gap-2 text-primary">
                <UserPlus class="h-5 w-5" />
                <CardTitle>Client Details</CardTitle>
              </div>
              <CardDescription>
                Enter the primary contact and billing information for the new customer.
              </CardDescription>
            </CardHeader>
            
            <CardContent class="space-y-6">
              {/* Contact Information Section */}
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Contact2 size={16} /> Basic Information
                </div>
                <div class="grid gap-4">
                  <div class="grid gap-2">
                    <Label for="name">Full Name / Business Name</Label>
                    <Input id="name" name="name" placeholder="e.g. Acme Carpentry or John Doe" required />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="grid gap-2">
                      <Label for="email">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                    </div>
                    <div class="grid gap-2">
                      <Label for="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+254..." required />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address Section */}
              <div class="space-y-4">
                <div class="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <MapPinned size={16} /> Billing Address
                </div>
                <div class="grid gap-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="grid gap-2">
                      <Label for="poBox">P.O. Box</Label>
                      <Input id="poBox" name="poBox" placeholder="12345" />
                    </div>
                    <div class="grid gap-2">
                      <Label for="postalCode">Postal Code</Label>
                      <Input id="postalCode" name="postalCode" placeholder="00100" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="grid gap-2">
                      <Label for="city">City</Label>
                      <Input id="city" name="city" placeholder="Nairobi" required />
                    </div>
                    <div class="grid gap-2">
                      <Label for="country">Country</Label>
                      <Input id="country" name="country" placeholder="Kenya" required />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter class="flex justify-between border-t bg-muted/50 px-6 py-4">
              <Button variant="ghost" type="button" onClick={() => navigate("/dashboard/clients")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading()} class="min-w-[120px]">
                <Show when={loading()} fallback={<><Save class="mr-2 h-4 w-4" /> Save Client</>}>
                  <Loader2 class="mr-2 h-4 w-4 animate-spin" /> Saving...
                </Show>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}