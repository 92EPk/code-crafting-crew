import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAttributes, useAttributeOptions, useAttributeDependencies } from '@/hooks/useDynamicAttributes';
import { useToast } from '@/components/ui/use-toast';
import { Attribute, AttributeOption } from '@/types/attributes';

const AttributeManagement = () => {
  const { attributes, loading: attributesLoading, addAttribute, updateAttribute, deleteAttribute } = useAttributes();
  const { attributeOptions, addAttributeOption, updateAttributeOption, deleteAttributeOption } = useAttributeOptions();
  const { dependencies, addDependency, removeDependency } = useAttributeDependencies();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [optionDialogOpen, setOptionDialogOpen] = useState(false);
  const [dependencyDialogOpen, setDependencyDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [editingOption, setEditingOption] = useState<AttributeOption | null>(null);
  const [selectedAttributeForOptions, setSelectedAttributeForOptions] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    attribute_type: '',
    is_required: false,
    sort_order: 0,
  });

  const [optionFormData, setOptionFormData] = useState({
    name_ar: '',
    name_en: '',
    price_adjustment: 0,
    sort_order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAttribute) {
        await updateAttribute(editingAttribute.id, formData);
      } else {
        await addAttribute({ ...formData, is_active: true });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving attribute:', error);
    }
  };

  const handleOptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttributeForOptions) return;

    try {
      const optionData = {
        ...optionFormData,
        attribute_id: selectedAttributeForOptions,
        is_active: true,
      };

      if (editingOption) {
        await updateAttributeOption(editingOption.id, optionData);
      } else {
        await addAttributeOption(optionData);
      }
      
      setOptionDialogOpen(false);
      resetOptionForm();
    } catch (error) {
      console.error('Error saving option:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      attribute_type: '',
      is_required: false,
      sort_order: 0,
    });
    setEditingAttribute(null);
  };

  const resetOptionForm = () => {
    setOptionFormData({
      name_ar: '',
      name_en: '',
      price_adjustment: 0,
      sort_order: 0,
    });
    setEditingOption(null);
  };

  const handleEdit = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name_ar: attribute.name_ar,
      name_en: attribute.name_en,
      description_ar: attribute.description_ar || '',
      description_en: attribute.description_en || '',
      attribute_type: attribute.attribute_type,
      is_required: attribute.is_required,
      sort_order: attribute.sort_order,
    });
    setDialogOpen(true);
  };

  const handleEditOption = (option: AttributeOption) => {
    setEditingOption(option);
    setOptionFormData({
      name_ar: option.name_ar,
      name_en: option.name_en,
      price_adjustment: option.price_adjustment,
      sort_order: option.sort_order,
    });
    setSelectedAttributeForOptions(option.attribute_id);
    setOptionDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this attribute?')) {
      try {
        await deleteAttribute(id);
      } catch (error) {
        console.error('Error deleting attribute:', error);
      }
    }
  };

  const handleDeleteOption = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      try {
        await deleteAttributeOption(id);
      } catch (error) {
        console.error('Error deleting option:', error);
      }
    }
  };

  const getAttributeOptions = (attributeId: string) => {
    return attributeOptions.filter(option => option.attribute_id === attributeId);
  };

  if (attributesLoading) {
    return <div className="flex justify-center items-center h-48">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attribute Management</h1>
          <p className="text-muted-foreground">Manage menu customization attributes and their options</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Attribute
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAttribute ? 'Edit Attribute' : 'Add New Attribute'}</DialogTitle>
              <DialogDescription>
                Create or modify attributes for menu customization
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_ar">Arabic Name</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_en">English Name</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="attribute_type">Attribute Type</Label>
                <Input
                  id="attribute_type"
                  value={formData.attribute_type}
                  onChange={(e) => setFormData({ ...formData, attribute_type: e.target.value })}
                  placeholder="e.g., serving_type, sauce_type, bread_type"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description_ar">Arabic Description</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description_en">English Description</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_required"
                  checked={formData.is_required}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
                />
                <Label htmlFor="is_required">Required by default</Label>
              </div>

              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAttribute ? 'Update' : 'Add'} Attribute
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {attributes.map((attribute) => (
          <Card key={attribute.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {attribute.name_en} / {attribute.name_ar}
                    {attribute.is_required && <Badge variant="secondary">Required</Badge>}
                  </CardTitle>
                  <CardDescription>
                    Type: {attribute.attribute_type} | Order: {attribute.sort_order}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAttributeForOptions(attribute.id);
                      setOptionDialogOpen(true);
                      resetOptionForm();
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(attribute)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(attribute.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attribute.description_en && (
                  <p className="text-sm text-muted-foreground">{attribute.description_en}</p>
                )}
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Options ({getAttributeOptions(attribute.id).length})</h4>
                  <div className="grid gap-2">
                    {getAttributeOptions(attribute.id).map((option) => (
                      <div key={option.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <span className="font-medium">{option.name_en} / {option.name_ar}</span>
                          {option.price_adjustment !== 0 && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({option.price_adjustment > 0 ? '+' : ''}{option.price_adjustment} EGP)
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditOption(option)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteOption(option.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {getAttributeOptions(attribute.id).length === 0 && (
                      <p className="text-sm text-muted-foreground">No options added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Option Dialog */}
      <Dialog open={optionDialogOpen} onOpenChange={setOptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingOption ? 'Edit Option' : 'Add New Option'}</DialogTitle>
            <DialogDescription>
              Add or modify options for the selected attribute
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOptionSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="option_name_ar">Arabic Name</Label>
                <Input
                  id="option_name_ar"
                  value={optionFormData.name_ar}
                  onChange={(e) => setOptionFormData({ ...optionFormData, name_ar: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="option_name_en">English Name</Label>
                <Input
                  id="option_name_en"
                  value={optionFormData.name_en}
                  onChange={(e) => setOptionFormData({ ...optionFormData, name_en: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="price_adjustment">Price Adjustment (EGP)</Label>
              <Input
                id="price_adjustment"
                type="number"
                step="0.01"
                value={optionFormData.price_adjustment}
                onChange={(e) => setOptionFormData({ ...optionFormData, price_adjustment: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="option_sort_order">Sort Order</Label>
              <Input
                id="option_sort_order"
                type="number"
                value={optionFormData.sort_order}
                onChange={(e) => setOptionFormData({ ...optionFormData, sort_order: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOptionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingOption ? 'Update' : 'Add'} Option
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttributeManagement;