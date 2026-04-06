import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Switch } from '@/app/components/ui/switch';
import { Slider } from '@/app/components/ui/slider';
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';
import { Palette, Trophy, Settings, Download, Plus, Trash2, Eye, Users, MonitorSmartphone, Sparkles, Monitor, Lock, BarChart, Gift, Edit, Layout, Image as ImageIcon } from 'lucide-react';
import { Prize } from '@/types';

export const AdminView: React.FC = () => {
  const {
    state,
    updateBrand,
    addPrize,
    updatePrize,
    deletePrize,
    updateMessages,
    updateGameConfig,
    updateDemoConfig,
    updateCarouselConfig,
    resetDailyCount,
    exportLeads,
  } = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [newPrize, setNewPrize] = useState<Partial<Prize>>({
    name: '',
    description: '',
    probability: 10,
    maxWins: 10,
    currentWins: 0,
    color: '#6366f1',
    textColor: '#ffffff',
    active: true,
  });

  const handleLogin = () => {
    // Simple password check (in production, use proper authentication)
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleAddPrize = () => {
    if (newPrize.name && newPrize.description) {
      addPrize({
        id: Date.now().toString(),
        ...newPrize,
      } as Prize);
      setNewPrize({
        name: '',
        description: '',
        probability: 10,
        maxWins: 10,
        currentWins: 0,
        color: '#6366f1',
        textColor: '#ffffff',
        active: true,
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Lock className="w-16 h-16 text-indigo-600" />
            </div>
            <CardTitle className="text-center text-2xl">Panel de Administración</CardTitle>
            <CardDescription className="text-center">
              Ingresa la contraseña para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">
                Iniciar Sesión
              </Button>
              <p className="text-xs text-center text-gray-500">
                Contraseña por defecto: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalParticipants = state.participants.length;
  const todayParticipants = state.gameConfig.currentDailyCount;
  const prizesGiven = state.participants.filter((p) => p.prizeWon !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-slate-400">
            Gestiona tu sistema de ruleta de premios
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participantes Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParticipants}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participantes Hoy</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayParticipants}</div>
              <p className="text-xs text-muted-foreground">
                de {state.gameConfig.dailyLimit} límite diario
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premios Entregados</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prizesGiven}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="prizes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 h-auto gap-2 bg-transparent p-0">
            <TabsTrigger value="prizes" className="bg-slate-800 data-[state=active]:bg-indigo-600 text-white border border-slate-700 h-12">
              <Gift className="w-4 h-4 mr-2 hidden sm:block" />
              Premios
            </TabsTrigger>
            <TabsTrigger value="branding" className="bg-slate-800 data-[state=active]:bg-indigo-600 text-white border border-slate-700 h-12">
              <Palette className="w-4 h-4 mr-2 hidden sm:block" />
              Marca
            </TabsTrigger>
            <TabsTrigger value="carousel" className="bg-slate-800 data-[state=active]:bg-indigo-600 text-white border border-slate-700 h-12">
              <Layout className="w-4 h-4 mr-2 hidden sm:block" />
              Carrusel
            </TabsTrigger>
            <TabsTrigger value="messages" className="bg-slate-800 data-[state=active]:bg-indigo-600 text-white border border-slate-700 h-12">
              <Edit className="w-4 h-4 mr-2 hidden sm:block" />
              Mensajes
            </TabsTrigger>
            <TabsTrigger value="demo" className="bg-slate-800 data-[state=active]:bg-indigo-600 text-white border border-slate-700 h-12">
              <Monitor className="w-4 h-4 mr-2 hidden sm:block" />
              Demo
            </TabsTrigger>
            <TabsTrigger value="leads" className="bg-slate-800 data-[state=active]:bg-indigo-600 text-white border border-slate-700 h-12">
              <Users className="w-4 h-4 mr-2 hidden sm:block" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="config" className="bg-slate-800 data-[state=active]:bg-indigo-600 text-white border border-slate-700 h-12">
              <Settings className="w-4 h-4 mr-2 hidden sm:block" />
              Config
            </TabsTrigger>
          </TabsList>

          {/* Prizes Tab */}
          <TabsContent value="prizes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Premios</CardTitle>
                <CardDescription>
                  Administra los premios disponibles en la ruleta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Prize */}
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-4">
                  <h3 className="font-semibold">Agregar Nuevo Premio</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre del Premio</Label>
                      <Input
                        value={newPrize.name}
                        onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
                        placeholder="Ej: 50% de descuento"
                      />
                    </div>
                    <div>
                      <Label>Descripción</Label>
                      <Input
                        value={newPrize.description}
                        onChange={(e) => setNewPrize({ ...newPrize, description: e.target.value })}
                        placeholder="Descripción corta"
                      />
                    </div>
                    <div>
                      <Label>Probabilidad (%)</Label>
                      <Input
                        type="number"
                        value={newPrize.probability}
                        onChange={(e) =>
                          setNewPrize({ ...newPrize, probability: parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <Label>Máximo de Veces</Label>
                      <Input
                        type="number"
                        value={newPrize.maxWins}
                        onChange={(e) =>
                          setNewPrize({ ...newPrize, maxWins: parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <Label>Color del Segmento</Label>
                      <Input
                        type="color"
                        value={newPrize.color}
                        onChange={(e) => setNewPrize({ ...newPrize, color: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Color del Texto</Label>
                      <Input
                        type="color"
                        value={newPrize.textColor}
                        onChange={(e) => setNewPrize({ ...newPrize, textColor: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddPrize} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Premio
                  </Button>
                </div>

                {/* Prizes List */}
                <div className="space-y-2">
                  {state.prizes.map((prize) => (
                    <div
                      key={prize.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1 w-full">
                        <div
                          className="w-12 h-12 rounded-full shrink-0"
                          style={{ backgroundColor: prize.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{prize.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{prize.description}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="secondary" className="text-[10px] sm:text-xs">{prize.probability}% probabilidad</Badge>
                            <Badge variant="outline" className="text-[10px] sm:text-xs">
                              {prize.currentWins}/{prize.maxWins} entregados
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground sm:hidden">Activo:</span>
                          <Switch
                            checked={prize.active}
                            onCheckedChange={(checked) => updatePrize(prize.id, { active: checked })}
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePrize(prize.id)}
                          className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3 sm:py-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:ml-2 sm:inline">Eliminar</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalización de Marca</CardTitle>
                <CardDescription>
                  Configura la identidad visual del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo White Label</Label>
                    <p className="text-sm text-muted-foreground">
                      Oculta la marca del sistema y usa la tuya
                    </p>
                  </div>
                  <Switch
                    checked={state.brand.isWhiteLabel}
                    onCheckedChange={(checked) => updateBrand({ isWhiteLabel: checked })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label className="text-sm font-semibold">Nombre de la Empresa</Label>
                    <Input
                      value={state.brand.companyName}
                      onChange={(e) => updateBrand({ companyName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Nombre del Sistema</Label>
                    <Input
                      value={state.brand.systemName}
                      onChange={(e) => updateBrand({ systemName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-semibold">Texto Acompañante del Logo</Label>
                    <Input
                      value={state.brand.logoText || ''}
                      onChange={(e) => updateBrand({ logoText: e.target.value })}
                      placeholder="Ej: Nombre de tu marca"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Este texto aparecerá junto al logo en el preloader, formulario y resultados.
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label>Logotipo de la Marca</Label>
                    <div className="mt-2 flex items-center gap-4">
                      {state.brand.logoUrl && (
                        <div className="relative group">
                          <img 
                            src={state.brand.logoUrl} 
                            alt="Logo preview" 
                            className="h-16 w-16 object-contain border rounded p-1 bg-white" 
                          />
                          <button
                            onClick={() => updateBrand({ logoUrl: '' })}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updateBrand({ logoUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Sugerido: PNG o WebP con fondo transparente
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">Color Primario</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="color"
                          value={state.brand.primaryColor}
                          onChange={(e) => updateBrand({ primaryColor: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <span className="text-xs font-mono uppercase bg-slate-100 p-1 rounded border flex-1 text-center">
                          {state.brand.primaryColor}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Color Secundario</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="color"
                          value={state.brand.secondaryColor}
                          onChange={(e) => updateBrand({ secondaryColor: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <span className="text-xs font-mono uppercase bg-slate-100 p-1 rounded border flex-1 text-center">
                          {state.brand.secondaryColor}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Color de Fondo</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="color"
                          value={state.brand.backgroundColor}
                          onChange={(e) => updateBrand({ backgroundColor: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <span className="text-xs font-mono uppercase bg-slate-100 p-1 rounded border flex-1 text-center">
                          {state.brand.backgroundColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4 text-indigo-400">Personalización del Centro de la Ruleta</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <Label>Logotipo Central</Label>
                      <div className="mt-2 flex items-center gap-4">
                        {state.brand.centerLogoUrl && (
                          <div className="relative group">
                            <img 
                              src={state.brand.centerLogoUrl} 
                              alt="Center logo preview" 
                              className="h-16 w-16 object-contain border rounded p-1 bg-white" 
                            />
                            <button
                              onClick={() => updateBrand({ centerLogoUrl: '' })}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  updateBrand({ centerLogoUrl: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Sugerido: Imagen cuadrada con fondo transparente
                          </p>
                        </div>
                      </div>
                    </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label className="text-sm font-semibold">Fondo Central (Principal)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="color"
                          value={state.brand.centerBgColor}
                          onChange={(e) => updateBrand({ centerBgColor: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <span className="text-xs font-mono uppercase bg-slate-100 p-1 rounded border flex-1 text-center">
                          {state.brand.centerBgColor}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Fondo Central (Secundario)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="color"
                          value={state.brand.centerBgSecondaryColor}
                          onChange={(e) => updateBrand({ centerBgSecondaryColor: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <span className="text-xs font-mono uppercase bg-slate-100 p-1 rounded border flex-1 text-center">
                          {state.brand.centerBgSecondaryColor}
                        </span>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Vista Previa</h3>
                  <div
                    className="p-8 rounded-lg text-white text-center"
                    style={{
                      background: `linear-gradient(135deg, ${state.brand.backgroundColor} 0%, ${state.brand.primaryColor} 100%)`,
                    }}
                  >
                    {state.brand.logoUrl ? (
                      <img src={state.brand.logoUrl} alt="Logo" className="h-20 mx-auto mb-4" />
                    ) : (
                      <h2 className="text-3xl font-bold mb-4">{state.brand.companyName}</h2>
                    )}
                    <p className="text-lg opacity-90">Vista previa del diseño</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mensajes del Sistema</CardTitle>
                <CardDescription>
                  Personaliza los textos mostrados a los usuarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Mensaje de Bienvenida</Label>
                  <Input
                    value={state.messages.welcome}
                    onChange={(e) => updateMessages({ welcome: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Mensaje Antes de Girar</Label>
                  <Input
                    value={state.messages.beforeSpin}
                    onChange={(e) => updateMessages({ beforeSpin: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Mensaje de Felicitación</Label>
                  <Input
                    value={state.messages.congratulations}
                    onChange={(e) => updateMessages({ congratulations: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Mensaje del Premio</Label>
                  <Textarea
                    value={state.messages.prizeMessage}
                    onChange={(e) => updateMessages({ prizeMessage: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Texto de Términos</Label>
                  <Textarea
                    value={state.messages.termsText}
                    onChange={(e) => updateMessages({ termsText: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Marco de Demo</CardTitle>
                <CardDescription>
                  Personaliza el marco del tótem donde se proyecta la pantalla en la vista de demostración
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Imagen del Marco del Tótem</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {state.demoConfig.frameImageUrl && (
                      <div className="relative group">
                        <img 
                          src={state.demoConfig.frameImageUrl} 
                          alt="Frame preview" 
                          className="h-16 w-16 object-contain border rounded p-1 bg-white" 
                        />
                        <button
                          onClick={() => updateDemoConfig({ frameImageUrl: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateDemoConfig({ frameImageUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Imagen del marco del tótem. Debe tener una zona clara donde se proyectará la pantalla interactiva.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <h3 className="font-semibold">Posición de la Pantalla en el Marco</h3>
                    <button
                      onClick={() => updateDemoConfig({
                        screenTop: '5.3%',
                        screenLeft: '12.6%',
                        screenWidth: '76.5%',
                        screenHeight: '54%',
                        screenBorderRadius: '8px',
                      })}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors w-full sm:w-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M8 16H3v5"/>
                      </svg>
                      Reset a Valores por Defecto
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ajusta los valores de posición para alinear la pantalla interactiva con el área del marco.
                    Los valores son porcentajes relativos a la imagen del marco.
                  </p>
                  
                  <div className="!flex flex-col xl:grid xl:grid-cols-2 gap-x-8 gap-y-12 xl:gap-y-8">
                    {/* Position Top */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Posición Superior (top)</Label>
                        <span className="text-sm font-mono bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full text-purple-700 dark:text-purple-300">
                          {state.demoConfig.screenTop}
                        </span>
                      </div>
                      <Slider
                        value={[parseFloat(state.demoConfig.screenTop) || 0]}
                        onValueChange={(value) => updateDemoConfig({ screenTop: `${value[0]}%` })}
                        min={0}
                        max={50}
                        step={0.1}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Distancia desde la parte superior del marco
                      </p>
                    </div>

                    {/* Position Left */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Posición Izquierda (left)</Label>
                        <span className="text-sm font-mono bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full text-purple-700 dark:text-purple-300">
                          {state.demoConfig.screenLeft}
                        </span>
                      </div>
                      <Slider
                        value={[parseFloat(state.demoConfig.screenLeft) || 0]}
                        onValueChange={(value) => updateDemoConfig({ screenLeft: `${value[0]}%` })}
                        min={0}
                        max={50}
                        step={0.1}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Distancia desde el borde izquierdo del marco
                      </p>
                    </div>

                    {/* Width */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Ancho (width)</Label>
                        <span className="text-sm font-mono bg-indigo-100 dark:bg-indigo-900 px-3 py-1 rounded-full text-indigo-700 dark:text-indigo-300">
                          {state.demoConfig.screenWidth}
                        </span>
                      </div>
                      <Slider
                        value={[parseFloat(state.demoConfig.screenWidth) || 0]}
                        onValueChange={(value) => updateDemoConfig({ screenWidth: `${value[0]}%` })}
                        min={10}
                        max={100}
                        step={0.1}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Ancho de la pantalla como porcentaje del marco
                      </p>
                    </div>

                    {/* Height */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Alto (height)</Label>
                        <span className="text-sm font-mono bg-indigo-100 dark:bg-indigo-900 px-3 py-1 rounded-full text-indigo-700 dark:text-indigo-300">
                          {state.demoConfig.screenHeight}
                        </span>
                      </div>
                      <Slider
                        value={[parseFloat(state.demoConfig.screenHeight) || 0]}
                        onValueChange={(value) => updateDemoConfig({ screenHeight: `${value[0]}%` })}
                        min={10}
                        max={100}
                        step={0.1}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Altura de la pantalla como porcentaje del marco
                      </p>
                    </div>

                    {/* Border Radius - mantenemos input para permitir px, rem, etc */}
                    <div className="col-span-2 space-y-3">
                      <Label>Radio de Borde (border-radius)</Label>
                      <Input
                        value={state.demoConfig.screenBorderRadius}
                        onChange={(e) => updateDemoConfig({ screenBorderRadius: e.target.value })}
                        placeholder="8px"
                        className="max-w-xs"
                      />
                      <p className="text-xs text-muted-foreground">
                        Redondeo de las esquinas de la pantalla (px, rem, etc.)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Vista Previa en Tiempo Real</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Observa cómo se posiciona la pantalla en el marco mientras ajustas los valores
                  </p>
                  
                  {/* Visual Preview */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-8 flex justify-center items-center overflow-hidden">
                    <div className="relative" style={{ maxWidth: '400px', width: '100%' }}>
                      {/* Marco del tótem */}
                      <img
                        src={state.demoConfig.frameImageUrl}
                        alt="Marco del Tótem"
                        className="w-full h-auto object-contain select-none"
                        draggable={false}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      
                      {/* Pantalla overlay con los valores configurados */}
                      <div
                        className="absolute bg-gradient-to-br from-purple-500/40 to-indigo-500/40 backdrop-blur-sm border-2 border-purple-500 transition-all duration-300"
                        style={{
                          top: state.demoConfig.screenTop,
                          left: state.demoConfig.screenLeft,
                          width: state.demoConfig.screenWidth,
                          height: state.demoConfig.screenHeight,
                          borderRadius: state.demoConfig.screenBorderRadius,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Monitor className="w-12 h-12 mx-auto mb-2 opacity-70" />
                            <p className="text-sm font-semibold opacity-90">Pantalla Interactiva</p>
                            <p className="text-xs opacity-70 mt-1">1080 x 1920</p>
                          </div>
                        </div>
                        
                        {/* Dimensiones en las esquinas */}
                        <div className="absolute -top-6 left-0 text-xs font-mono text-purple-700 bg-white px-2 py-1 rounded shadow-sm">
                          {state.demoConfig.screenTop}
                        </div>
                        <div className="absolute top-0 -left-12 text-xs font-mono text-purple-700 bg-white px-2 py-1 rounded shadow-sm">
                          {state.demoConfig.screenLeft}
                        </div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-purple-700 bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap">
                          {state.demoConfig.screenWidth} × {state.demoConfig.screenHeight}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón para ver demo completo */}
                  <div className="flex justify-center mt-6">
                    <Button asChild size="lg" className="gap-2">
                      <a href="/demo" target="_blank">
                        <Eye className="w-5 h-5" />
                        Ver Demo Completo Interactivo
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Valores Actuales:</h4>
                  <div className="text-sm space-y-1 font-mono">
                    <p className="break-all"><span className="text-muted-foreground">URL:</span> {state.demoConfig.frameImageUrl || 'No configurada'}</p>
                    <p><span className="text-muted-foreground">Top:</span> {state.demoConfig.screenTop}</p>
                    <p><span className="text-muted-foreground">Left:</span> {state.demoConfig.screenLeft}</p>
                    <p><span className="text-muted-foreground">Width:</span> {state.demoConfig.screenWidth}</p>
                    <p><span className="text-muted-foreground">Height:</span> {state.demoConfig.screenHeight}</p>
                    <p><span className="text-muted-foreground">Border Radius:</span> {state.demoConfig.screenBorderRadius}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Participantes y Leads</CardTitle>
                    <CardDescription>Gestiona los datos capturados</CardDescription>
                  </div>
                  <Button onClick={exportLeads}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Correo</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Premio</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.participants.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No hay participantes aún
                          </TableCell>
                        </TableRow>
                      ) : (
                        state.participants.slice().reverse().map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell className="font-medium">{participant.name}</TableCell>
                            <TableCell>{participant.email}</TableCell>
                            <TableCell>{participant.phone}</TableCell>
                            <TableCell>
                              {participant.prizeWon ? (
                                <Badge
                                  style={{
                                    backgroundColor: participant.prizeWon.color,
                                    color: participant.prizeWon.textColor,
                                  }}
                                >
                                  {participant.prizeWon.name}
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Sin premio</Badge>
                              )}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {new Date(participant.timestamp).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Juego</CardTitle>
                <CardDescription>
                  Ajusta el comportamiento del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Límite Diario de Participaciones</Label>
                    <Input
                      type="number"
                      value={state.gameConfig.dailyLimit}
                      onChange={(e) =>
                        updateGameConfig({ dailyLimit: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Duración del Giro (ms)</Label>
                    <Input
                      type="number"
                      value={state.gameConfig.spinDuration}
                      onChange={(e) =>
                        updateGameConfig({ spinDuration: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Registro Obligatorio</Label>
                      <p className="text-sm text-muted-foreground">
                        Requiere registro antes de jugar
                      </p>
                    </div>
                    <Switch
                      checked={state.gameConfig.requireRegistration}
                      onCheckedChange={(checked) =>
                        updateGameConfig({ requireRegistration: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Activar Sonidos</Label>
                      <p className="text-sm text-muted-foreground">
                        Reproduce sonidos durante el juego
                      </p>
                    </div>
                    <Switch
                      checked={state.gameConfig.enableSounds}
                      onCheckedChange={(checked) => updateGameConfig({ enableSounds: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Activar Animaciones</Label>
                      <p className="text-sm text-muted-foreground">
                        Muestra animaciones visuales
                      </p>
                    </div>
                    <Switch
                      checked={state.gameConfig.enableAnimations}
                      onCheckedChange={(checked) => updateGameConfig({ enableAnimations: checked })}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={resetDailyCount} className="w-full sm:w-auto">
                    Reiniciar Contador Diario
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm('¿Estás seguro de querer borrar todos los datos?')) {
                        localStorage.removeItem('prizeWheelState');
                        window.location.reload();
                      }
                    }}
                    className="w-full sm:w-auto"
                  >
                    Resetear Todo el Sistema
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Carousel Tab */}
          <TabsContent value="carousel" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Carrusel de Logotipos</CardTitle>
                    <CardDescription>Configura los logotipos que aparecen en la parte inferior</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="carousel-grayscale" className="text-sm">Blanco y Negro</Label>
                      <Switch
                        id="carousel-grayscale"
                        checked={state.carouselConfig?.grayscale ?? false}
                        onCheckedChange={(checked) => updateCarouselConfig({ grayscale: checked })}
                      />
                    </div>
                    <div className="flex items-center gap-2 border-l pl-4">
                      <Label htmlFor="carousel-active" className="text-sm">Activo</Label>
                      <Switch
                        id="carousel-active"
                        checked={state.carouselConfig?.active ?? true}
                        onCheckedChange={(checked) => updateCarouselConfig({ active: checked })}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Color de Fondo del Carrusel</Label>
                    <div className="flex gap-2">
                      <div className="relative group">
                        <input
                          type="color"
                          value={state.carouselConfig?.backgroundColor || '#ffffff00'}
                          onChange={(e) => updateCarouselConfig({ backgroundColor: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white shadow-sm"
                        />
                      </div>
                      <Input
                        value={state.carouselConfig?.backgroundColor || 'transparent'}
                        onChange={(e) => updateCarouselConfig({ backgroundColor: e.target.value })}
                        placeholder="Ej: #ffffff o transparent"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Velocidad de Desplazamiento (segundos)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[state.carouselConfig?.speed || 20]}
                        onValueChange={(value) => updateCarouselConfig({ speed: value[0] })}
                        min={5}
                        max={60}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-mono bg-slate-100 p-1 rounded text-center">
                        {state.carouselConfig?.speed || 20}s
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Elementos del Carrusel</h3>
                    <Button 
                      onClick={() => {
                        const newItem = {
                          id: Date.now().toString(),
                          imageUrl: '',
                          altText: 'Nuevo Logo'
                        };
                        updateCarouselConfig({ 
                          items: [...(state.carouselConfig?.items || []), newItem] 
                        });
                      }}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Logo
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(state.carouselConfig?.items || []).map((item, index) => (
                      <div key={item.id} className="relative bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 group">
                        <button
                          onClick={() => {
                            const newItems = state.carouselConfig.items.filter(i => i.id !== item.id);
                            updateCarouselConfig({ items: newItems });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-4 pt-2">
                          <div className="flex items-center justify-center p-4 bg-white rounded-lg border-2 border-dashed border-slate-200 h-24 overflow-hidden relative">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.altText}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <div className="text-slate-400 text-sm flex flex-col items-center">
                                <ImageIcon className="w-8 h-8 mb-1 opacity-20" />
                                Sin imagen
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider text-slate-500">Subir Logo</Label>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const newItems = [...state.carouselConfig.items];
                                    newItems[index] = { ...item, imageUrl: reader.result as string };
                                    updateCarouselConfig({ items: newItems });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="text-xs h-9 cursor-pointer"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider text-slate-500">Descripción (Alt)</Label>
                            <Input
                              value={item.altText}
                              onChange={(e) => {
                                const newItems = [...state.carouselConfig.items];
                                newItems[index] = { ...item, altText: e.target.value };
                                updateCarouselConfig({ items: newItems });
                              }}
                              placeholder="Nombre del aliado/estratégico"
                              className="h-9"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(state.carouselConfig?.items || []).length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                      <Layout className="w-12 h-12 mx-auto mb-2 opacity-10" />
                      <p>No hay elementos en el carrusel aún.</p>
                      <p className="text-sm">Agrega logotipos de marcas o aliados para mostrarlos en la ruleta.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};