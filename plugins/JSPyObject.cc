#include "JSPyObject.h"

Napi::FunctionReference JSPyObject::constructor;

void JSPyObject::Initialize(Napi::Env& env, Napi::Object& exports)
{
    Napi::HandleScope scope(env);
    Napi::Function ctor = DefineClass(env, "JSPyObject", {
        // InstanceMethod("valueOf", &ValueOf)
        InstanceMethod("getAttr", &JSPyObject::getAttr),
        InstanceMethod("call", &JSPyObject::call)
    });

    constructor = Napi::Persistent(ctor);
    constructor.SuppressDestruct();

    exports.Set("JSPyObject", ctor);
}

JSPyObject::JSPyObject(const Napi::CallbackInfo& info) :
    ObjectWrap<JSPyObject>(info) { 
        this->__py_object = info[0].As<Napi::External<PyObject>>().Data();
}

JSPyObject::~JSPyObject()
{
    PyThreadStateLock py_thread_lock;
    Py_XDECREF(__py_object);
    __py_object = NULL;
}

Napi::Value JSPyObject::getAttr(const Napi::CallbackInfo& args)
{
    PyThreadStateLock py_thread_lock;
    
    Napi::Env env = args.Env();
    std::string attrName = args[0].As<Napi::String>();
    PyObject * objAttribute = PyObject_GetAttrString(
        this->__py_object, attrName.c_str()
    );

    if (objAttribute == NULL) {
        return env.Undefined();
    }

    auto instance = JSPyObject::constructor.New({ 
        Napi::External<PyObject>::New(args.Env(), objAttribute) 
    });

    return instance;
}

Napi::Value JSPyObject::call(const Napi::CallbackInfo& args)
{
    PyThreadStateLock py_thread_lock;
    Napi::Env env = args.Env();

    std::string attrName = args[0].As<Napi::String>();
    
    PyObject * pyArgs = PyTuple_New(args.Length());

    PyTuple_SetItem(pyArgs, 0, PyString_FromString(attrName.c_str()));

    PyObject_Call(this->__py_object, pyArgs, NULL);

    Py_XDECREF(pyArgs);

    return env.Undefined();
}