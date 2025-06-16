
import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function TagsInput({ value, onChange, placeholder, label }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === ';' || e.key === 'Enter') && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove última tag se input estiver vazio
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="space-y-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Digite e pressione ponto e vírgula (;) para adicionar tag..."}
        />
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="hover:bg-gray-300 rounded-full p-0.5 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
