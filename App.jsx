import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function Home() {
  return (
    <div>
      <Button>Click me</Button>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it Liv?</AccordionTrigger>
          <AccordionContent>
            Yes. It's Liv.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Are you happy?</AccordionTrigger>
          <AccordionContent>
            No.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
