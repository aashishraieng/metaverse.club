
import React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check, Star } from "lucide-react";

export function JoinDialog() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = React.useState(null);

  const handleJoin = () => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "Choose a membership plan to continue.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Welcome to Vibrance!",
      description: `You've selected the ${selectedPlan} plan. We'll contact you soon with next steps.`,
    });
  };

  const plans = [
    {
      name: "Basic",
      price: "$10/month",
      features: ["Access to community events", "Monthly newsletter", "Basic member benefits"],
    },
    {
      name: "Premium",
      price: "$25/month",
      features: ["All Basic features", "Priority event registration", "Exclusive workshops", "Premium member perks"],
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 button-hover shine-effect">Join Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Vibrance</DialogTitle>
          <DialogDescription>
            Choose your membership plan and start your journey with us.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedPlan === plan.name
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{plan.name}</h3>
                <span className="text-primary font-bold">{plan.price}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              {selectedPlan === plan.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-2 text-primary text-sm font-medium flex items-center gap-1"
                >
                  <Star className="h-4 w-4" /> Selected
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleJoin} className="w-full">
            Continue with {selectedPlan || "selected plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
